ActiveRecord::Base.establish_connection adapter: 'sqlite3',
                                        database: 'sqlite3:employee-directory.sqlite3'

seeded = !ActiveRecord::Base.connection.tables.empty?

unless seeded
  ActiveRecord::Migration.verbose = true
  ActiveRecord::Schema.define(version: 1) do
    create_table :employees do |t|
      t.string :first_name
      t.string :last_name
      t.integer :age
      t.string :position
      t.integer :department_id, index: true
    end

    create_table :departments do |t|
      t.string :name
    end
  end
end

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end

class Employee < ApplicationRecord
  belongs_to :department

  validates_presence_of :first_name, :last_name, :position, :department_id

  # The age limit is a shameless, time-saving direct copy of the number range
  # used in EmployeeCreationModal.tsx; see that for further commentary.
  #
  validates_numericality_of :age, only_integer: true, in: (16..80)

  # This should be backed by a database constraint in the 'real world'. In a
  # Rails migration:
  #
  #   add_index :employees, [:first_name, :last_name, :department_id], unique: true
  #
  # Why don't I do this below?
  #
  #   validates_uniqueness_of :first_name, scope: [:last_name, :department_id]
  #
  # ...because that'll yield e.g. "First name has been taken". The out-of-box
  # validation helper can only validate on a single attribute. This results in
  # a misleading error; both first *and* last names were taken.
  #
  validate do
    existing_employee = Employee
      .where(
        first_name:    self.first_name,
        last_name:     self.last_name,
        department_id: self.department_id
      )
      .where.not(id: self.id)
      .exists?

    if existing_employee
      errors.add(:base, 'First and last name must be unique within a department')
    end
  end
end

class Department < ApplicationRecord
  has_many :employees

  validates_presence_of :name
end

unless seeded
  departments = [
    Department.create!(name: 'Engineering'),
    Department.create!(name: 'Product'),
    Department.create!(name: 'Legal'),
    Department.create!(name: 'Marketing'),
    Department.create!(name: 'Sales'),
    Department.create!(name: 'Support'),
    Department.create!(name: 'HR'),
    Department.create!(name: 'Finance'),
    Department.create!(name: 'Operations'),
    Department.create!(name: 'IT')
  ]

  1000.times do
    Employee.create!(
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      age: rand(18..65),
      position: Faker::Job.title,
      department: departments.sample
    )
  end
end
