import React, { FunctionComponent, InputHTMLAttributes } from "react";
import $ from "./InputText.module.css";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder: string;
}

const InputText: FunctionComponent<InputTextProps> = ({
  name,
  placeholder,
  className,
  ...rest
}) => {
  return (
    <input
      aria-label={name}
      className={`${$.inputText} ${className || ""}`}
      name={name}
      placeholder={placeholder}
      type="text"
      {...rest}
    />
  );
};

export default InputText;
