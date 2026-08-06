import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            block w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-slate-900 placeholder-slate-400
            transition-all duration-200 outline-none
            focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10
            disabled:bg-slate-50 disabled:text-slate-400
            ${icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-accent-rose focus:border-accent-rose focus:ring-accent-rose/10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-accent-rose font-medium">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900
          transition-all duration-200 outline-none
          focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10
          disabled:bg-slate-50 disabled:text-slate-400
          ${error ? 'border-accent-rose focus:border-accent-rose focus:ring-accent-rose/10' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-accent-rose font-medium">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const areaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={areaId} className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        rows={3}
        className={`
          block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400
          transition-all duration-200 outline-none
          focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10
          disabled:bg-slate-50 disabled:text-slate-400
          ${error ? 'border-accent-rose focus:border-accent-rose focus:ring-accent-rose/10' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-accent-rose font-medium">{error}</p>}
    </div>
  );
};
