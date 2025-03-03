// Presents a menu of departments, which can have either single or multiple
// selection semantics according to the "isMultiple" property. The menu always
// allows the selection to be cleared.
//
// The on-change handler is given either an array of objects ("isMultiple" is
// 'true') or one object ("isMultiple" is 'false') for selected item(s) with
// property "label" giving the department's name and "value" holding the actual
// Department resource instances read by Graffiti; ignore any other properties
// that may be present). If the callback is called with 'null', the department
// selection has been cleared.
//
import React, { useState, useEffect } from 'react';
import Select from "react-tailwindcss-select";

import { Department } from '../Models';

export interface DepartmentMenuProps {
  isMultiple: boolean;
  onChange:   (data: any | null) => void;
};

export const DepartmentMenu: React.FC<DepartmentMenuProps> = ({ onChange, isMultiple }) => {

  // ===========================================================================
  // Dynamic state
  // ===========================================================================

  const [isLoading,             setIsLoading            ] = useState<boolean      >( true );
  const [error,                 setError                ] = useState<string | null>( null );
  const [allDepartments,        setAllDepartments       ] = useState<any[]        >( []   );
  const [chosenDepartments,     setChosenDepartments    ] = useState<any    | null>( null );
  const [longestName,           setLongestName          ] = useState<number       >( 0    );

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
        response.data.map(department => ({label: department.name, value: department}))
      )

      setLongestName(
        Math.max(...response.data.map(department => department.name?.length || 0))
      );

    } catch (err) {
      setError(`Could not fetch departments: ${err}`);
      setIsLoading(false);
    }
  };

  const chosenDepartmentsDidChange = (selectedOptions: any) => {
    onChange(selectedOptions);
    setChosenDepartments(selectedOptions);
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

  // TODO: Overriding native components always causes trouble! The multi-select
  //       plugin looks OK in the filter bar but by default it set its height
  //       in drop-down to an exact multiple of entries, making it impossible
  //       to realise that scrolling was needed. Up at the top of the page and
  //       in the main flow, it can be left unconstrained and the user can
  //       scroll the viewport if that is narrow. The is-single use case right
  //       now is the Add modal, centred; this is at a fixed position and does
  //       not cause viewport extension if the menu drops off screen. Native
  //       widgets wouldn't do that... For now, just hack it with a small size!
  //
  return (
    <div
      className="react-tailwindcss-select-container"
      style={{opacity: isLoading ? 0.5 : 1, minWidth: `${longestName}em`}}
    >
      <Select
        classNames={{list: `${isMultiple ? 'max-h-full' : 'max-h-[39vh]'} overflow-y-auto`}}
        primaryColor={'blue'}
        isMultiple={isMultiple}
        isClearable={true}
        isSearchable={false}
        isDisabled={isLoading}
        options={allDepartments}
        value={chosenDepartments}
        onChange={values => { chosenDepartmentsDidChange(values); }}
        placeholder={'Departments...'}
      />
    </div>
  );
};
