// Conforms to the SelfContainedModalProps interface to provide a button which
// when clicked shows an Employee creation form in a modal. The visibility of
// that modal is managed internally. It invokes your supplied on-close callback
// when it closes, whether due to successful creation, cancellation or any
// other reason; Employee data might have changed, so if the caller cares, you
// should update your view just in case.
//
// This may seem inefficient, but it's not that common for someone to start
// adding a new employee and then give up, so that's an unusual edge case and
// it's better to keep the internal on-close API very simple.
//
import React, { useState } from 'react';

import { SelfContainedModalProps } from '../interfaces/SelfContainedModalProps';
import { Button                  } from './Button';
import { EmployeeCreationModal   } from './EmployeeCreationModal';

export const EmployeeCreationButton: React.FC<SelfContainedModalProps> = ({ onClose }) => {
  const [modalOpen, setModalOpen ] = useState<boolean>( false );

  const modalWantsToClose = () => {
    onClose();           // Invoke callback provided by the component's creator
    setModalOpen(false); // Set state so that the modal hides itself
  };

  return (
    <div>
      <Button onClick={() => setModalOpen(true)} buttonText="Add employee..." />
      <EmployeeCreationModal isOpen={modalOpen} onClose={modalWantsToClose} />
    </div>
  );
}
