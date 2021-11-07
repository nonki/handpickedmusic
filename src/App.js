import './App.css';

import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import Color from 'color';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { createContext, useContext, useState, useMemo } from 'react';

import Music from './Music.js';
import Debug from './Debug.js';

export const ColorModeContext = createContext({ setPrimaryColor: () => {}, setSecondaryColor: () => {} });

const isValidColor = (color) => {
  if (color.charAt(0) !== '#')
    return false;

  let colorCode = color.substring(1);
  if (colorCode.length > 6)
    return false;

  let re = /^[a-fA-F0-9]+$/
  return re.test(colorCode)
}

function App() {
  const [color, setColor] = useState('#');
  const context = useContext(ColorModeContext);

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'secondary.main',
        height: '100%',
        width: '100%',
      }}>
      <Container
        sx={{
          textAlign: 'center',
        }}>
        <Typography variant='h2'>
          Welcome!
        </Typography>
        <Input value={color} onChange={(e) => isValidColor(e.target.value) && setColor(e.target.value)} />
        <Button variant='contained' color='secondary' onClick={() => context.setPrimaryColor(color)}>
          Submit
        </Button>
      </Container>
      <Music />
      <Debug />
    </Box>
  );
}

const ToggleColorMode = () => {
  const [primaryColor, setPrimaryColor] = useState('#4abadf');
  const [secondaryColor, setSecondaryColor] = useState('#df704a');
  const colorMode = useMemo(
    () => ({
      setPrimaryColor: (primaryColor) => {
        setPrimaryColor(primaryColor);
      }
    }),
    []
  );

  useMemo(() => setSecondaryColor(Color(primaryColor).rotate(180).hex()), [primaryColor]);

  const [textColor, setTextColor] = useState('light');
  useMemo(() => {
      const color = (primaryColor.charAt(0) === '#') ? primaryColor.substring(1, 7) : primaryColor;
      const r = parseInt(color.substring(0, 2), 16); // hexToR
      const g = parseInt(color.substring(2, 4), 16); // hexToG
      const b = parseInt(color.substring(4, 6), 16); // hexToB
      setTextColor((((r * 0.299) + (g * 0.587) + (b * 0.114)) > 140) ? 'light' : 'dark');
    },
    [primaryColor]
  );

  const theme = useMemo(
    () =>
      responsiveFontSizes(createTheme({
        palette: {
          mode: textColor,
          primary: {
            main: primaryColor,
          },
          secondary: {
            main: secondaryColor,
          },
        },
      })),
    [textColor, primaryColor, secondaryColor]
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
