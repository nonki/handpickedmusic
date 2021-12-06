import './App.css';

import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import Color from 'color';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import { createContext, useState, useMemo } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';

import Music from './Music.js';
import Upload from './Upload.js';
import Future from './Future.js';

export const TrackContext = createContext({ track: {}, trackId: '', preview: false, setTrackId: () => {}, setTrack: () => {}, setPreview: () => {} });

function App() {
  const [cookies] = useCookies(['admin'])

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        height: '100%',
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
      }}
    justifyContent="center">
      {cookies.admin && <Upload />}
      {cookies.admin && <Future />}
      <Container
        sx={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
        }}
      >
        <Music />
      </Container>
    </Box>
  );
}

const TrackThemedApp = () => {
  const [trackId, setTrackId] = useState('')
  const [track, setTrack] = useState({})
  const [primaryColor, setPrimaryColor] = useState('#ffffff');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const [preview, setPreview] = useState(false);

  const trackFn = useMemo(
    () => ({
      track: track,
      trackId: trackId,
      preview: preview,
      setTrack: (track) => {
        setTrack(track)
      },
      setTrackId: (trackId) => {
        setTrackId(trackId)
      },
      setPreview: (preview) => {
        setPreview(preview)
      }
    }),
    [track, trackId, preview]
  );

  useMemo(() => setPrimaryColor(`#${track.colorHex || "ffffff"}`), [track])
  useMemo(() => {
    const primaryColorObj = Color(primaryColor)
    let secondaryColorObj = primaryColorObj.rotate(180)
    if (primaryColorObj.contrast(secondaryColorObj) > 1.1) {
      setSecondaryColor(secondaryColorObj.hex())
      return
    }

    if (primaryColorObj.isDark()) {
      secondaryColorObj = Color.rgb(255, 255, 255)
    } else {
      secondaryColorObj = Color.rgb(0, 0, 0)
    }

    setSecondaryColor(secondaryColorObj.hex())
  }, [primaryColor]);

  const [textColor, setTextColor] = useState('light');
  useMemo(() => {
    const color = Color(primaryColor)
    setTextColor(color.isDark() ? 'dark' : 'light');
  }, [primaryColor]);

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
    <TrackContext.Provider value={trackFn}>
      <ThemeProvider theme={theme}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </ThemeProvider>
    </TrackContext.Provider>
  );
}

export default TrackThemedApp;
