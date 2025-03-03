import React from 'react';

import { Employee                   } from './Models';
import { EmployeeColumns            } from './columns/EmployeeColumns';
import { FilterAbilities            } from './classes/FilterAbilities';
import { EmployeeFullNameFilter     } from './components/EmployeeFullNameFilter';
import { EmployeeByDepartmentFilter } from './components/EmployeeByDepartmentFilter';
import { List                       } from './components/List';

const employeeFilterAbilities = new FilterAbilities(
  [
    EmployeeFullNameFilter,
    EmployeeByDepartmentFilter,
  ]
);

const App: React.FC = () => {
  return (
    <List
      listColumns={EmployeeColumns}
      spraypaintModel={Employee}
      filterAbilities={employeeFilterAbilities}
    />
  );
}

export default App
