// Used by components that wrap a Modal and provide their own child content for
// a specific use - for example, presenting a form that edits an Employee. The
// 'context' parameter can be used to convey special information if needed,
// e.g. the Employee to edit, specified in a component-dependent way.
//
export interface CommonModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  context?: any;
}
