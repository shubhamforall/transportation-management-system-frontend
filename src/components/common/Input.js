import React from 'react';

const Input = ({ type = 'text', placeholder, required = false }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full p-3 rounded border border-gray-300"
    />
  );
};

export default Input;
