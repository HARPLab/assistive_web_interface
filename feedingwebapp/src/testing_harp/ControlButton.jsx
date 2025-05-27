import React from 'react';

export default function ControlButton({ direction, onPress, onRelease, children, className, ariaLabel }) {
  return (
    <button
      className={className}
      aria-label={ariaLabel}
      onMouseDown={() => onPress(direction)}
      onMouseUp={onRelease}
      onTouchStart={() => onPress(direction)}
      onTouchEnd={onRelease}
    >
      {children}
    </button>
  );
}
