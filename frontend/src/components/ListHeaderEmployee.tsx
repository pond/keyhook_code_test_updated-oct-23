import { Employee } from './Models';

export const ListHeaderEmployee = ({ item }: { item: Employee }) => (
  <tr className="list-tr">
    <th className="list-th text-left">Given name</th>
    <th className="list-th text-left">Family name</th>
    <th className="list-th text-left">Department</th>
    <th className="list-th text-left">Role</th>
    <th className="list-th text-center">Age</th>
  </tr>
);
