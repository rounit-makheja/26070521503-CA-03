import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  isBlock = false,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`btn btn-${variant} ${isBlock ? 'btn-block' : ''} ${className}`}
    >
      {isLoading && <span className={`spinner-icon ${variant === 'outline' ? 'spinner-dark' : ''}`} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
};
