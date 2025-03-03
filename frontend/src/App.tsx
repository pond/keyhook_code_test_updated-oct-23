import React from 'react';

import { Employee        } from './Models';
import { EmployeeColumns } from './columns/EmployeeColumns';
import { List            } from './components/List';

const App: React.FC = () => {
  return (
    <List listColumns={EmployeeColumns} spraypaintModel={Employee} />
  );
}

export default App
