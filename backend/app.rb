require 'faker'
require 'active_record'
require './seeds'
require 'kaminari'
require 'sinatra/base'
require 'graphiti'
require 'graphiti/adapters/active_record'
require 'debug'

require_relative 'constants'

class ApplicationResource < Graphiti::Resource
  self.abstract_class = true
  self.adapter = Graphiti::Adapters::ActiveRecord
  self.base_url = 'http://localhost:4567'
  self.endpoint_namespace = '/api/v1'
  # implement Graphiti.config.context_for_endpoint for validation
  self.validate_endpoints = false
end

class DepartmentResource < ApplicationResource
  has_many :employees

  self.model = Department
  self.type = :departments

  attribute :name, :string
end

class EmployeeResource < ApplicationResource
  belongs_to :department

  self.model = Employee
  self.type = :employees

  attribute :first_name,    :string
  attribute :last_name,     :string
  attribute :age,           :integer
  attribute :position,      :string
  attribute :department_id, :integer, only: [:filterable]

  # It's easiest to provide API support for sorting by department name directly
  # here and take the server-side step of a secondary sort on last name, to
  # keep client-side definitions simplified.
  #
  sort :department_name, :string do |scope, value|
    scope.joins(:department).order("departments.name #{value}, last_name asc")
  end

  # With Graphiti, if you try to get only employees in a named department thus:
  #
  #   GET .../employees?include=department&filter[department.name]=Foo
  #
  # ...then it still lists all employees, but omits any departments that do not
  # match out of the "included" section of the JSON API response. That is, its
  # filters don't work on the target resource in the API call; they work on the
  # target resource indicated by the filter's dotted / JSONAPI type expression.
  # The above example, doesn't filter employees; it filters the included
  # departments.
  #
  # This is not what we usually want when we provide a filter expression for a
  # particular resource endpoint.
  #
  # We want a way to return *only* those employees in named department(s). For
  # this, filter "department_name" (i.e. with an underscore instead of a dot)
  # will return only employees matching the department name(s) in full (no
  # wildcards), but case-insensitive.
  #
  filter :department_name, :string, only: [:eq] do
    eq do |scope, values|
      value = values.shift
      scope = scope.joins(:department)
      query = scope.where('LOWER("departments"."name") = ?', value.downcase)

      values.each do | value |
        query = query.or(scope.where('LOWER("departments"."name") = ?', value.downcase))
      end

      query
    end
  end

  # The EmployeeFullNameFilter React component uses this. A quirk is that since
  # this is intended to be invoked via Spraypaint on the JavaScript side as a
  # generic filter operation, it is always going to use "eq" by default - but
  # we actually perform a wildcard search, case insensitive, across first and
  # last name.
  #
  filter :full_name, :string, single: true, only: [:eq] do
    eq do |scope, value|
      safe_name = ActiveRecord::Base.sanitize_sql_like(value.downcase)
      scope.where("LOWER(first_name || ' ' || last_name) LIKE ?", "%#{safe_name}%")
    end
  end
end

Graphiti.setup!

class EmployeeDirectoryApp < Sinatra::Application
  configure do |c|
    mime_type :jsonapi, 'application/vnd.api+json'

    logger = Logger.new($stdout)
    logger.level = Logger::DEBUG
    set :logger, logger

    ActiveRecord::Base.logger = logger
  end

  before do
    content_type :jsonapi

    if ENV['SLEEPY'].present?
      time = ENV['SLEEPY'].to_f
      time = 1.0 if time.zero?
      sleep time
    end
  end

  after do
    ActiveRecord::Base.connection_handler.clear_active_connections!
  end

  get '/api/v1/departments' do
    departments = DepartmentResource.all(list_for(params))
    departments.to_jsonapi
  end

  # For possible future use...
  #
  # get '/api/v1/departments/:id' do
  #   department = DepartmentResource.find(find_with(params))
  #   department.to_jsonapi
  # end

  get '/api/v1/employees' do
    employees = EmployeeResource.all(list_for(params, include: 'department'))
    employees.to_jsonapi
  end

  # For possible future use...
  #
  # get '/api/v1/employees/:id' do
  #   employee = EmployeeResource.find(find_with(params, include: 'department'))
  #   employee.to_jsonapi
  # end

  # No Rails safe-params here! We'll assign anything. I'd *never* do this in
  # Production code. Implemented largely "the hard way" - Graphiti has no
  # coherent documentation on this that I can find, with online examples of
  # Graphiti using Rails and e.g. "render jsonapi_errors: employee" is of no
  # use here.
  #
  # It took a lot of debugging with the difficult-to-drive resource proxy
  # implementation to realise that Graphiti assumes HashWithIndifferentAccess
  # and *does not* work out-of-box with a String-keyed params bundle. Juggling
  # debugging between this and the Spraypaint side is a chore, but the end
  # result - when both sides are properly written - is nice and terse, except
  # for error handling (which I suspect can be done a better way if you know
  # Graphiti well enough).
  #
  post '/api/v1/employees' do
    payload = JSON.parse(request.body.read)
    payload.deep_symbolize_keys!

    employee = EmployeeResource.build(payload)

    if employee.save
      employee.to_jsonapi
    else
      [422, jsonapi_errors(employee).to_json]
    end
  end

  # ============================================================================
  # PRIVATE INSTANCE METHODS
  # ============================================================================
  #
  private

    # Takes a params bundle (from the query string only, in Sinatra) for a GET
    # request intended to list resources. Optionally add an "include" parameter
    # for Graphiti, along with merging DEFAULT_PARAMS and imposing a limit via
    # MAX_PAGE_SIZE constraint.
    #
    # URI params will override everything except the page size constraint.
    #
    # Returns the result, intended for use in "Resource.all(...)".
    #
    def list_for(params, include: nil)
      base            = DEFAULT_PARAMS.deep_dup # See "constants.rb"
      base['include'] = include unless include.nil?
      combined_params = base.merge(params)

      combined_params['page']['size'] = MAX_PAGE_SIZE unless (
        combined_params.dig('page', 'size').nil? ||
        combined_params.dig('page', 'size')&.to_i <= MAX_PAGE_SIZE # See "constants.rb"
      )

      combined_params
    end

    # Single-instance analogue of #list_for, intended for use in
    # "Resource.find(...)".
    #
    def find_with(params, include: nil)
      base            = {}
      base['include'] = include unless include.nil?
      combined_params = base.merge(params)

      combined_params
    end

    # Returns a Hash of JSONAPI-compliant error data for the given
    # ActiveRecord model instance that holds validation errors. Return as a
    # response via e.g. "[422, errors_hash.to_json]".
    #
    def jsonapi_errors(model)
      errors = model.errors.map do |error|
        js_field = error.attribute.to_s.camelize.downcase_first

        {
          code:   'unprocessable_entity',
          status: '422',
          title:  'Validation Error',
          detail: error.full_message,
          source: { pointer: "/data/attributes/#{js_field}" },
          meta: {

            # Ruby-esque name; can't tell from docs the expectation, since the
            # example uses "title" which is unhelpful. Given other parts of the
            # meta bundle seem relevant to ActiveRecord concepts so it makes
            # sense that the attribute would *not* use the JS-style name.
            #
            attribute: error.attribute,
            message: error.message,
            code: error.type
          }
        }
      end

      return { errors: errors }
    end
end
