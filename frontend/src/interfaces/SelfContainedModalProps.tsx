// Used by components that wrap both a Modal and lifecycle management, so that
// an extremely simple invocation interface exists - just provide an on-close
// handler, which is invoked with no parameters.
//
export interface SelfContainedModalProps {
  onClose: () => void;
}
