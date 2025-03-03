import { Employee } from './Models';

export const ListItemEmployee = ({ item }: { item: Employee }) => (
  <tr key={item.id} className="list-tr">
    <td className="list-td">
      {item.firstName}
    </td>
    <td className="list-td">
      <span className="font-semibold">{item.lastName}</span>
    </td>
    <td className="list-td">
      {item.department.name}
    </td>
    <td className="list-td">
      <span className="text-gray-600">{item.position}</span>
    </td>
    <td className="list-td text-center">
      <span className="text-gray-600">{item.age}</span>
    </td>
  </tr>
);
