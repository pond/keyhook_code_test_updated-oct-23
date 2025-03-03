import { createColumnHelper } from '@tanstack/react-table';
import { Employee           } from '../Models';

type  EmployeeType       = InstanceType<typeof Employee>;
type  EmployeeAttributes = EmployeeType['attributes'];
const columnHelper       = createColumnHelper<EmployeeAttributes>();

export const EmployeeColumns = [
  columnHelper.accessor(
    'firstName', {
      header:        'Given name',
      enableSorting: true,
      meta:          { thClasses: 'text-left' },
    }
  ),
  columnHelper.accessor(
    'lastName',
    {
      header:        'Family name',
      enableSorting: true,
      cell:          props => <span className="font-semibold">{props.getValue()}</span>,
      meta:          { thClasses: 'text-left' },
    },
  ),
  columnHelper.accessor(
    'department.name', // This leads to sort key department_name as-is, which our API understands
    {
      header:        'Department',
      enableSorting: true,
      meta:          { thClasses: 'text-left' },
    },
  ),
  columnHelper.accessor(
    'position',
    {
      header:        'Role',
      enableSorting: true,
      meta:          { thClasses: 'text-left', tdClasses: 'text-gray-500' },
    },
  ),
  columnHelper.accessor(
    'age',
    {
      header:        'Age',
      enableSorting: true,
      meta:          { thClasses: 'text-left sm:text-right', tdClasses: 'text-left sm:text-right text-gray-500' },
    }
  ),
];
