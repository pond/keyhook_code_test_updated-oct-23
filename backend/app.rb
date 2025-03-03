require 'faker'
require 'active_record'
require './seeds'
require 'kaminari'
require 'sinatra/base'
require 'graphiti'
require 'graphiti/adapters/active_record'

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
  filter :department_name, :string do
    eq do |scope, values|
      value = values.shift
      scope = scope.joins(:department)
      query = scope.where('lower("departments"."name") = ?', value.downcase)

      values.each do | value |
        query = query.or(scope.where('lower("departments"."name") = ?', value.downcase))
      end

      query
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
  end

  after do
    ActiveRecord::Base.connection_handler.clear_active_connections!
  end

  get '/api/v1/departments' do
    departments = DepartmentResource.all(list_for(params))
    departments.to_jsonapi
  end

  get '/api/v1/departments/:id' do
    department = DepartmentResource.find(find_with(params))
    department.to_jsonapi
  end

  get '/api/v1/employees' do
    employees = EmployeeResource.all(list_for(params, include: 'department'))
    employees.to_jsonapi
  end

  get '/api/v1/employees/:id' do
    employee = EmployeeResource.find(find_with(params, include: 'department'))
    employee.to_jsonapi
  end

  # ============================================================================
  # PRIVATE INSTANCE METHODS
  # ============================================================================
  #
  private

    def list_for(params, include: nil)
      base            = DEFAULT_PARAMS # See "constants.rb"
      base['include'] = include unless include.nil?
      combined_params = base.merge(params)

      combined_params['page']['size'] = MAX_PAGE_SIZE unless (
        combined_params.dig('page', 'size').nil? ||
        combined_params.dig('page', 'size')&.to_i <= MAX_PAGE_SIZE # See "constants.rb"
      )

      combined_params
    end

    def find_with(params, include: nil)
      base            = {}
      base['include'] = include unless include.nil?
      combined_params = base.merge(params)

      combined_params
    end

end
