// Used by e.g. the List component to render buttons that may lead to changes
// in the collection being listed. Present mostly to help with type-safety.
//
// Initialise with an array of React components that all conform to the
// SelfContainedModalProps interface.
//
// For an example, see App.tsx.
//
import React from 'react';

export class ButtonCollection {
  constructor(
    public buttonComponents: React.ComponentType<any>[] = []
  ) {}
}
