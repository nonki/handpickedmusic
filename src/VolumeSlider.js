import { useState } from "react";
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

const VolumeSlider = ({ defaultValue, handler }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event, newValue) => {
    console.log(newValue);
    handler(newValue);
    setValue(newValue);
  }

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1, width: "100%" }} alignItems="center">
      <VolumeDown color="secondary" />
      <Slider aria-label="Volume" color="secondary" value={value} onChange={handleChange} />
      <VolumeUp color="secondary" />
    </Stack>
  )
}

export default VolumeSlider;
