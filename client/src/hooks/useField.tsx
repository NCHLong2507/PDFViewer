import { useState } from "react";

const useFormField = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (error) setError('');
  };

  return {
    value,
    error,
    setValue,
    setError,
    bind: {
      value,
      onChange: handleChange,
    },
    errorBorderClass: error
      ? 'border-[1.5px] border-[rgba(144,11,9,1)]'
      : 'border-[1px] border-[#D9D9D9]',
  };
};

export default useFormField;