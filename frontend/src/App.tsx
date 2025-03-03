import React from 'react';

import { Employee                   } from './Models';
import { EmployeeColumns            } from './columns/EmployeeColumns';
import { FilterAbilities            } from './classes/FilterAbilities';
import { ButtonCollection           } from './classes/ButtonCollection';
import { EmployeeFullNameFilter     } from './components/EmployeeFullNameFilter';
import { EmployeeByDepartmentFilter } from './components/EmployeeByDepartmentFilter';
import { EmployeeCreationButton     } from './components/EmployeeCreationButton';
import { List                       } from './components/List';

const employeeFilterAbilities = new FilterAbilities([
  EmployeeFullNameFilter,
  EmployeeByDepartmentFilter,
]);

const buttonCollection = new ButtonCollection([
  EmployeeCreationButton
]);

const App: React.FC = () => {
  return (
    <List
      listColumns={EmployeeColumns}
      spraypaintModel={Employee}
      filterAbilities={employeeFilterAbilities}
      buttonCollection={buttonCollection}
    />
  );
}

export default App
