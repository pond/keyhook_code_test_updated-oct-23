// Used by e.g. the List component to declare supported filter abilities.
// Present mostly to ensure type-safety. Initialise with an array of React
// components that all conform to the FilterProps interface. For an example
// of a producer, see App.tsx; and for a consumer, the List component.
//
import React from 'react';

export class FilterAbilities {
  constructor(
    public filterComponents: React.ComponentType<any>[] | null = null
  ) {}
}
