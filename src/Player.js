import React, { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Pause from '@mui/icons-material/Pause';
import PlayArrow from '@mui/icons-material/PlayArrow';
import VolumeSlider from './VolumeSlider.js';

const useAudio = url => {
  const [audio, setAudio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1);

  const playMusic = React.useMemo(
    () =>
      playing,
    [playing]
  );

  audio.volume = volume

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    setPlaying(false)
    setAudio(new Audio(url))
  }, [url])

  const setAudioVolume = (newVolume) => {
    const audioVolume = newVolume / 100;
    audio.volume = audioVolume;
    setVolume(audioVolume);
  }

  useEffect(() => {
    playMusic ? audio.play() : audio.pause();
  });

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  });

  return [playMusic, toggle, volume, setAudioVolume];
};

const Player = ({ url }) => {
  const [playing, toggle, volume, setVolume] = useAudio(url);

  return (
    <Stack direction="row" spacing="2" alignItems="center" sx={{ m: 1, minWidth: 300 }}>
      <IconButton
        onClick={toggle}>
        {playing ? <Pause color="textSecondary"/> : <PlayArrow color="textSecondary"/>}
      </IconButton>
      <VolumeSlider
        defaultValue={volume * 100}
        handler={setVolume} />
    </Stack>
  );
};

export default Player;
