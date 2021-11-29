import './App.css';

import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import Color from 'color';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { createContext, useContext, useState, useMemo } from 'react';

import Music from './Music.js';
import Upload from './Upload.js';

export const TrackContext = createContext({ track: {}, trackId: '', preview: false, setTrackId: () => {}, setTrack: () => {}, setPreview: () => {} });

function App() {
  const context = useContext(TrackContext);
  let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)admin\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        height: '100%',
        width: '100%',
      }}>
    <Container
      sx={{
        textAlign: 'center',
        bgcolor: 'primary.main',
        height: '100%',
        width: '100%',
      }}>
      {cookieValue && <Upload />}
      <Container
        sx={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          transform: 'translate(0%, -50%)',
          top: '50%',
        }}
      >
        <Music />
      </Container>
    </Container>
    </Box>
  );
}

const TrackThemedApp = () => {
  const [trackId, setTrackId] = useState('')
  const [track, setTrack] = useState({})
  const [primaryColor, setPrimaryColor] = useState('#4abadf');
  const [secondaryColor, setSecondaryColor] = useState('#df704a');
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

  useMemo(() => setPrimaryColor(`#${track.colorHex || "4abadf"}`), [track])
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
    <TrackContext.Provider value={trackFn}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </TrackContext.Provider>
  );
}

export default TrackThemedApp;
