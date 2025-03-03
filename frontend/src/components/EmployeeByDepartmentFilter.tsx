// Presents a multi-select that can filter the 'employees' endpoint by
// department(s).
//
// Conforms to the FilterProps interface, so usable via FilterAbilities.
//
import React, { useState, useEffect } from 'react';
import Select from "react-tailwindcss-select";
import { Department } from '../Models';
import { FilterProps } from './FilterProps';

export const EmployeeByDepartmentFilter: React.FC<FilterProps> = ({ onChange }) => {

  // ===========================================================================
  // Dynamic state
  // ===========================================================================

  const [isLoading,             setIsLoading            ] = useState<boolean      >( true );
  const [error,                 setError                ] = useState<string | null>( null );
  const [allDepartments,        setAllDepartments       ] = useState<any[]        >( [] );
  const [chosenDepartments,     setChosenDepartments    ] = useState<any[]        >( [] );
  const [longestName,           setLongestName          ] = useState<number       >( 0 );

  // ===========================================================================
  // Functions
  // ===========================================================================

  const fetchAllDepartments = async () => {
    try {
      setIsLoading(true);

      // Ordinarily we'd filter by department ID to guarantee uniqueness and
      // validity, along with making the server's life easier, but the tast at
      // hand specifically states that department must be found by name only.
      //
      const response = await Department.select(['name']).order({name: 'asc'}).all();

      setIsLoading(false);

      setAllDepartments(
        response.data.map(department => ({label: department.name, value: department.name}))
      )

      setLongestName(
        Math.max(...response.data.map(department => department.name.length))
      );

    } catch (err) {
      setError(`Could not fetch departments: ${err}`);
      setIsLoading(false);
    }
  };

  const chosenDepartmentsDidChange = (selectedOptions: any) => {
    if (selectedOptions) {
      const chosenDepartmentNames = selectedOptions.map(
        function(selectedOption: any) { return selectedOption.value; }
      );

      onChange({department_name: chosenDepartmentNames.join(',')});
      setChosenDepartments(selectedOptions);
    } else {
      onChange({department_name: ''});
      setChosenDepartments([]);
    }
  };

  // ===========================================================================
  // Initialisation
  // ===========================================================================

  useEffect(() => {
    fetchAllDepartments();
  }, []);

  // ===========================================================================
  // Rendering
  // ===========================================================================

  if (error) {
    return (
      <div className="text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div
      className="react-tailwindcss-select-container"
      style={{opacity: isLoading ? 0.5 : 1, minWidth: `${longestName}em`}}
    >
      <Select
        classNames={{list: 'max-h-full overflow-y-auto'}}
        primaryColor={'blue'}
        isMultiple={true}
        isClearable={true}
        isSearchable={false}
        isDisabled={isLoading}
        options={allDepartments}
        value={chosenDepartments.length > 0 ? chosenDepartments : null}
        onChange={values => { chosenDepartmentsDidChange(values); }}
        placeholder={'Departments...'}
      />
    </div>
  );
};
