import React from 'react';

export const FormField = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
  disabled = false,
  children
}) => {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-dot" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {children || (
          <input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`form-input ${error ? 'input-error' : ''}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className="field-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
