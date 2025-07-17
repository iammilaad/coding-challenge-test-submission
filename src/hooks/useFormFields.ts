import { useState } from "react";

type FormFields = {
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
};

export function useFormFields<T extends Record<string, any>>(initialState: T) {
  const [fields, setFields] = useState<T>(initialState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const clearFields = () => {
    setFields(initialState);
  };

  return { fields, onChange, clearFields };
}
