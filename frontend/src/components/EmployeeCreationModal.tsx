// Presents a form which allows for creation of a new Employee. There is no
// need to specify 'context'.
//
// TODO: A future enhancement might (with an appropriate rename) allow this
//       form to be used to create or edit an employee, via 'context' providing
//       (or omitting) an Employee instance to work with.
//
import React, { useState } from 'react';
import { AccessorKeyColumnDef } from '@tanstack/react-table';

import { Modal            } from './Modal';
import { CommonModalProps } from '../interfaces/CommonModalProps';
import { EmployeeColumns  } from '../columns/EmployeeColumns';
import { DepartmentMenu   } from './DepartmentMenu';
import { Employee         } from '../Models';

type EmployeeType       = InstanceType<typeof Employee>;
type EmployeeAttributes = EmployeeType['attributes'];

export const EmployeeCreationModal: React.FC<CommonModalProps> = ({ isOpen, onClose, context }) => {

  const [department, setDepartment ] = useState<any | null>( null );

  // Currently unused => TS complains. Work around it.
  //
  context = context;

  // TODO: This uses very, very basic validation on the *client* side. We ought
  //       to actually handle the SprayPaint 422 response and extract exact
  //       info from the server response, then decorate the form accordingly.
  //
  const generateInput = (column: AccessorKeyColumnDef<EmployeeAttributes, any>) => {
    switch(column.accessorKey) {
      case 'department.name': {
        return (
          <div>
            <DepartmentMenu
              isMultiple={false}
              onChange={(selectedOption) => {
                setDepartment(selectedOption?.value || null);
              }}
            />
          </div>
        );
      }

      // Of course, normally we'd either not know or care about employee age
      // other than "legal to work", but if we did know it, we'd store that
      // as a date of birth and calculate dynamically. Nobody wants to update
      // the list of employees manually every time there's a birthday!
      //
      // In this codebase the schema just stores age as a number, so for this
      // input - nobody below 16 can work here and we think it's rather cruel
      // to push people to work past 80 years old, though we wouldn't have a
      // corporate policy to that effect! 80 would just mean "80 or older".
      //
      case 'age': {
        return (
          <input className="standard-input" type="number" min="16" max="80" name={column.accessorKey} required />
        );
      }

      default: {
        return (
          <input className="standard-input" type="text" name={column.accessorKey} required />
        );
      }
    }
  };

  // TODO: Disable Add on-submit and indicate activity while waiting for the
  //       server response (and make sure that's properly undone for all
  //       exit conditions, successful or otherwise). The user can dismiss the
  //       modal with "X" or clicking outside it at any time, too, which is
  //       depending on opinion either bad and should be disabled during form
  //       handling, or is fine but means we must make sure errors or
  //       on-success displays work whether or not the modal is visible.
  //
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form         = event.currentTarget;
    const formElements = form.elements;
    let   attributes   = {} as any;

    for (const element of formElements) {
      const forceCastElement = element as HTMLInputElement;
      const name:  string | undefined = forceCastElement.name;
      const value: string | undefined = forceCastElement.value;

      if (name) {
        attributes[name] = value;
      }
    };

    try {

      // With Spraypaint you can't just set departmentId on Employee :-(
      //
      const employee = new Employee(attributes);

      if (department) {
        employee.department = department;
      }

      const success  = await employee.save({with: 'department.id'});

      if (success) {
        onClose();

        for (const element of formElements) {
          const forceCastElement = element as HTMLInputElement;

          if (forceCastElement.name) {
            forceCastElement.value = '';
          }
        };
      } else {
        throw new Error('Something went wrong! Please try again later...');
      }
    } catch(err) {
      alert(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-6 text-center">Add employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-6">
          {
            EmployeeColumns.map((column, index) => (
              <div key={index} className="standard-input-group">
                <label className="standard-label" htmlFor={column.accessorKey}>{column.header?.toString()}</label>
                {generateInput(column)}
              </div>
            ))
          }
        </div>

        <div className="flex justify-center">
          <button type="submit" className="standard-button">Add</button>
        </div>
      </form>
    </Modal>
  );
};
