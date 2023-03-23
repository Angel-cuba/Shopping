import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

//Type for Theme context
type Theme = 'light' | 'dark'
//Theme context interface
interface ThemeContextInterface {
  theme: string
  setTheme: Dispatch<SetStateAction<Theme>>
}

export const ThemeContext = createContext<ThemeContextInterface>({
  theme: 'light'
} as ThemeContextInterface)

type Props = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: Props): JSX.Element {
  const [theme, setTheme] = useState<Theme>('light')
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
