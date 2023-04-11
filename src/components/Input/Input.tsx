import React from 'react';

type InputProps = {
  type?: string;
  name: string;
  placeholder: string;
  value: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style?: { [key: string]: string };
  className?: string;
  message?: string;
  admin?: boolean;
  profile?: boolean;
  small?: boolean;
  min?: string;
  max?: string;
};

export const Input = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  style,
  admin,
  profile,
  small,
}: InputProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: !admin ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: admin ? '100%' : small ? '100px' : '200px',
        marginLeft: admin ? '0' : '20px',
        padding: admin ? '10px' : '0',
        borderRadius: '5px',
      }}
    >
      <label
        style={{
          color: '#7e7e7e',
          width: profile ? '40%' : small ? '100px' : '80%',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
        htmlFor={name}
      >
        {name[0].toLocaleUpperCase() + name.slice(1)}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        style={style}
        onChange={onChange}
        autoComplete="off"
      />
    </div>
  );
};
