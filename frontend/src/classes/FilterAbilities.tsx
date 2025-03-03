// Used by e.g. the List component to render filters appropriate for the
// entity being listed. Present mostly to help with type-safety.
//
// Initialise with an array of React components that all conform to the
// CommonFilterProps interface.
//
// For an example, see App.tsx.
//
import React from 'react';

export class FilterAbilities {
  constructor(
    public filterComponents: React.ComponentType<any>[] = []
  ) {}
}
