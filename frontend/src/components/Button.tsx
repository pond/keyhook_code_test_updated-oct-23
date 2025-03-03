// Buttons provide a simple styled <button> that e.g. pops up a modal or enacts
// some other navigation via your provided "onClick" handler.
//
import React from 'react';

interface ButtonProps {
  onClick:    (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonText: string; // Text to show inside the constructed <button> element.
};

export const Button: React.FC<ButtonProps> = ({ onClick, buttonText }) => {
  return (
    <button onClick={onClick} className="standard-button">
      {buttonText}
    </button>
  );
}
