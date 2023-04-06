import React from 'react';

type InputProps = {
  type?: string;
  name: string;
  placeholder: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style?: { [key: string]: string };
  className?: string;
  // error: string,
  // touched: boolean,
  message?: string;
  admin?: boolean;
};

export const Input = ({ type, name, placeholder, value, onChange, style, admin }: InputProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: !admin ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: admin ? '100%' : '200px',
        marginLeft: admin ? '0' : '20px',
        padding: admin ? '10px' : '0',
      }}
    >
      <label style={{ color: '#313131', width: '80%', fontSize: '18px' }} htmlFor={name}>
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
