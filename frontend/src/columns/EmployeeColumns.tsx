import { createColumnHelper } from '@tanstack/react-table';
import { Employee           } from '../Models';

type ModelType = InstanceType<typeof Employee>;
type ModelAttributes = ModelType['attributes'];
const columnHelper = createColumnHelper<ModelAttributes>();

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
    'department.name', // This leads to sort key departmemt_name as-is, which our API understands
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
