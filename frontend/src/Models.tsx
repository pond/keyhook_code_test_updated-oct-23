// Spraypaint's internals seem to be written in such a way that all models must
// be defined in a single big file - splitting them up doesn't work, leading to
// errors such as 'Unknown type "departments"' when Employee tries to declare
// its relationship to Department (even if the Department constant is imported
// into that module).

import { SpraypaintBase, Model, Attr, HasMany, BelongsTo } from 'spraypaint';

@Model()
export class ApplicationRecord extends SpraypaintBase {
  static baseUrl      = 'http://127.0.0.1:4567';
  static apiNamespace = '/api/v1';
}

@Model()
export class Department extends ApplicationRecord {
  static jsonapiType  = 'departments';
  static singularName = 'department';

  @Attr() id:   number;
  @Attr() name: string;

  @HasMany() employees: Employee[];
}

@Model()
export class Employee extends ApplicationRecord {
  static jsonapiType  = 'employees';
  static singularName = 'employee';

  @Attr() id:        number;
  @Attr() firstName: string;
  @Attr() lastName:  string;
  @Attr() position:  string;
  @Attr() age:       number;

  @BelongsTo() department: Department[];
}
