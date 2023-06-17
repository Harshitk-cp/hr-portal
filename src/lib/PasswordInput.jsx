import { TextInput, ActionIcon, Input } from '@mantine/core';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <TextInput
      id="outlined-adornment-password"
      type={showPassword ? 'text' : 'password'}
      value={props.value}
      onChange={(event) => props.onChange(event.currentTarget.value)}
      
    ></TextInput>
  );
};

export default PasswordInput;
