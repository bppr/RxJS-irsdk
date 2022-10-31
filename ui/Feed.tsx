import React, { useContext } from 'react';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

import { IncidentDisplay } from './IncidentDisplay';
import { AppContext } from './AppContext';
import { IncidentGroup } from "./messages";

export default function Feed(props: { incidents: IncidentGroup[]; }) {
  const { clearAll } = useContext(AppContext);

  return <Grid item xs={4} sx={{ minWidth: 40 }}>
    <Stack spacing={2}>
      
      <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
        <Typography variant="h4">Incident Feed</Typography>
        <IconButton title="Clear Incidents" onClick={clearAll}>
          <Close sx={{ height: 32, width: 32 }} />
        </IconButton>
      </Stack>

      { props.incidents.map(i => <IncidentDisplay key={keyFor(i)} incident={i} />) }
      
    </Stack>
  </Grid>;
}

function keyFor({ car, time, types }: IncidentGroup) {
  return `${car.number}-${time.index}-${time.time}-${types.join(',')}`;
}
