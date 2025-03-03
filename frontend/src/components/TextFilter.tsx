// Returns an input field with the specified placeholder string and invokes
// the specified on-change callback function with this object:
//
//   { fieldName: "search-text" }
//
// ...using debounce to avoid calling too often as a user types in a search
// string. The filter value might be an empty string, but is never undefined.
//
// The target resource must implement a "field_name" 'eq' search field on
// the server side.
//
// IMPORTANT: This does not have to be used directly and, often, you'll want to
//            use a specialisation of this component which conforms to the
//            FilterProps interface for a more targeted search. For example,
//            see EmployeeFullNameFilter.
//
import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface TextFilterProps {
  filterField: string;
  placeholder: string;
  onChange:    (data: any) => void;
}

export const TextFilter: React.FC<TextFilterProps> = ({ filterField, placeholder, onChange }) => {
  const [searchString, setSearchString ] = useState<string | undefined>( undefined );
  const [debouncedSearchString] = useDebounce(searchString, 250);

  useEffect(() => {
    onChange({[filterField]: debouncedSearchString});
  }, [debouncedSearchString]);

  // Tortured stying via what amounts to Tailwind hacking compares classes on
  // the React TailwindCSS Select component used EmployeeByDepartmentFilter and
  // matches classes, but with some padding alterations to account for nested
  // containers bloating height in the select list. When a text field is seem
  // next to a Select component, font size, placeholder colour, hover animation
  // and border/shadow height along with physical metrics should all match.
  //
  // See also index.css where the Select placeholder/general display field is
  // styled to provide a less microscopic font and less bold placeholder.
  //
  return (
    <input
      className="text-base px-3 py-[10px] leading-[20px] border border-gray-300 transition-all duration-300 hover:border-gray-400 rounded shadow-sm"
      onChange={event => setSearchString(String(event.target.value))}
      placeholder={placeholder || 'Search...'}
    />
  );
};
