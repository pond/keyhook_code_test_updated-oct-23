import React from 'react';

export interface ModalProps extends React.PropsWithChildren {
  isOpen:   boolean;
  onClose:  () => void;
  children: React.ReactElement[]
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className={`modal-outer fixed inset-0 flex justify-center items-center transition-colors ${isOpen ? 'visible bg-black/40' : 'invisible'}`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`modal-inner bg-white rounded-xl shadow p-8 transition-all ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
      >
        <button
          onClick={onClose}
          className="modal-close absolute top-2 right-2 p-1 leading-none rounded-lg text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
        >
          ╳
        </button>

        {children}
      </div>
    </div>
  );
};
