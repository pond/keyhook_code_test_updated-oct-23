// A specialisation of TextFilter designed for the 'employees' endpoint which
// filters by full name.
//
// Conforms to the FilterProps interface, so usable via FilterAbilities.
//
import React from 'react';
import { FilterProps } from './FilterProps';
import { TextFilter } from './TextFilter';

export const EmployeeFullNameFilter: React.FC<FilterProps> = ({ onChange }) => {
  return (
    <TextFilter
      filterField="fullName"
      placeholder="Search names..."
      onChange={onChange}
    />
  )
}
