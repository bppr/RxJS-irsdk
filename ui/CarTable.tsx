import React from 'react';
import _ from 'lodash';
import { Grid, Stack, Typography } from '@mui/material';
import { IncidentGroup } from "./messages";

export default function CarTable(props: { incidents: IncidentGroup[]; }) {
  const cars = _.groupBy(props.incidents, i => i.car.number);

  return <Grid item xs={6} sx={{ minWidth: 400 }}>
    <Stack spacing={2}>
      <Typography variant="h4">Drivers</Typography>
      {_.map(cars, (incidents, key) => <CarIncidents key={key} incidents={incidents} />)}
    </Stack>
  </Grid>;
}
function CarIncidents(props: { incidents: IncidentGroup[]; }) {
  return <></>;
}
