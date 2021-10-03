import './App.css';

import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createContext, useState, useMemo } from 'react';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  return (
    <Container>
      <Typography variant="h2">
        Welcome!
      </Typography>
    </Container>
  );
}

const ToggleColorMode = () => {
  const [primaryColor, setPrimaryColor] = useState('#d796e9');
  const colorMode = useMemo(
    () => ({
      setPrimaryColor: (primaryColor) => {
        setPrimaryColor(primaryColor);
      }
    }),
    []
  );

  const theme = useMemo(
    () =>
      responsiveFontSizes(createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: primaryColor,
          },
        },
      })),
    [primaryColor]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default ToggleColorMode;
