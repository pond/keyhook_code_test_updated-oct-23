// Presents a multi-select that can filter the 'employees' endpoint by
// department(s).
//
// Conforms to the CommonFilterProps interface, so usable via FilterAbilities.
//
import React from 'react';

import { CommonFilterProps } from '../interfaces/CommonFilterProps'
import { DepartmentMenu    } from './DepartmentMenu';

export const EmployeeByDepartmentFilter: React.FC<CommonFilterProps> = ({ onChange }) => {
  const selectionDidChange = (selectedOptions: any) => {
    if (selectedOptions == null) {
      onChange({department_name: ''});
    } else {
      const chosenDepartmentNames = selectedOptions.map(
        function(selectedOption: any) { return selectedOption.label; } // (sic.)
      );

      onChange({department_name: chosenDepartmentNames.join(',')});
    }
  }

  return (
    <DepartmentMenu
      isMultiple={true}
      onChange={selectionDidChange}
    />
  );
}
