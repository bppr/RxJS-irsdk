import React, { useContext } from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import { Pause, PlayArrow, SkipNext } from '@mui/icons-material';

import { displayTime } from "../utils/displayTime";
import { AppContext } from "../AppContext";

const ICON_SIZE = { width: 64, height: 64 };

export default function Header() {
  const { gateway, system: { cameraState, replayState, session }} = useContext(AppContext);
  const isPaused = cameraState.isPaused;

  const _togglePlay = () => isPaused ? gateway.play() : gateway.pause()
  const _goLive = () => gateway.goLive()

  return <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
    <Typography variant="h3">👮 Stuart</Typography>

    <IconButton title={isPaused ? "Play" : "Pause"} sx={ICON_SIZE} onClick={_togglePlay}>
      {isPaused ? <PlayArrow /> : <Pause />}
    </IconButton>

    <IconButton title="Jump to Live" sx={ICON_SIZE} onClick={_goLive}>
      <SkipNext />
    </IconButton>

    <Stack sx={{ width: 300 }} spacing={0}>
      <Typography variant="h5">
        Live: S{session.index} ({session.type}) {displayTime(session.time)}
      </Typography>

      <Typography variant="h6">
        Replay: S{replayState.session} {displayTime(replayState.time)}
      </Typography>

      <Typography variant="subtitle1">
        Driver: #{cameraState.car.number} {cameraState.car.driver}
      </Typography>
    </Stack>
  </Stack>  
}