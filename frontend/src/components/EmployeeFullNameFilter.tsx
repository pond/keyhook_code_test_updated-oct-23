// A specialisation of TextFilter designed for the 'employees' endpoint which
// filters by full name.
//
// Conforms to the CommonFilterProps interface, so usable via FilterAbilities.
//
import React from 'react';

import { CommonFilterProps } from '../interfaces/CommonFilterProps';
import { TextFilter        } from './TextFilter';

export const EmployeeFullNameFilter: React.FC<CommonFilterProps> = ({ onChange }) => {
  return (
    <TextFilter
      filterField="fullName"
      placeholder="Search names..."
      onChange={onChange}
    />
  )
}
