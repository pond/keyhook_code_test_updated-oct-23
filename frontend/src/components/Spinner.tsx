// Provides a circular spinner to indicate ongoing activity.
//
// The spinner uses the 'visible' property so that styles are fully calculated
// and it remains in the view structure so anything that might otherwise change
// page formatting does not move around (consider if we'd used 'display:
// block/none' instead).
//
// This has an additional advantage that, combined with the classes assigned to
// the spinner, pure CSS can be used to implement a delay in appearance which
// may be desirable for activity related to remote fetches. Otherwise, rapid
// server responses can lead to a spinner flickering on and off quickly, which
// is rather distracting and ugly. Since sometimes busy-wait state needs to be
// indicated immediately though, this is opt-in via the "delayedShow" property.
//
interface SpinnerProps {
  active:      boolean; // True -> show spinner, possibly delayed (see below), else hide instantly
  delayedShow: boolean; // True -> auto-delay visibility by 300ms, else make visible instantly
}

import React, { useState, useEffect } from 'react';

export const Spinner: React.FC<SpinnerProps> = ({ active, delayedShow }) => {
  const wrapperStyle = active ? {visibility: 'visible'} : {visibility: 'hidden'};
  const wrapperClass = active ? (
    `spinner-active {delayedShow ? 'transition delay-300 duration-500 opacity-100' : ''}`
  ) : (
    'spinner-inactive opacity-0'
  );

  return (
    <div
      style={wrapperStyle}
      className={`spinner ${wrapperClass} inline-flex cursor-not-allowed items-center rounded-md transition`}
    >
      <svg
        className="mr-3 -ml-1 size-7 animate-spin text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};
