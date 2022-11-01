import React from 'react';
import { IconButton, Stack, TableCell, TableContainer, Table, TableHead, TableRow, Typography, TableBody } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { IncidentMsg } from "./App";
import { displayTime } from '../utils/displayTime';
import _ from 'lodash';

export function CarDetail(props: { incidents: IncidentMsg[]; unselectCar(): void; }) {
  const { incidents, unselectCar } = props;
  const { car } = incidents[0].data;

  const byType = _.groupBy(incidents, i => i.resolution ?? 'none');

  const showAllHandler = (ev: React.MouseEvent) => {
    ev.preventDefault();
    unselectCar()
  }

  return <Stack spacing={2}>
    <Stack direction="row">
      <IconButton aria-label="Show All" size="small" onClick={showAllHandler}>
        <KeyboardArrowLeft />
      </IconButton>

      <Typography variant="h5">#{car.number} {car.driver.name}</Typography>
    </Stack>

    <Typography variant="h6">Off-Tracks</Typography>
    <DetailTable data={byType['off-track'] ?? []} />

    <Typography variant="h6">Losses of Control</Typography>
    <DetailTable data={byType['loc'] ?? []} />
  </Stack>;
}

function DetailTable(props: { data: IncidentMsg[]}) {
  if(props.data.length === 0)
    return <Typography variant="subtitle2">Nothing yet.</Typography>

  const toRow = (msg: IncidentMsg) => {
    const incident = msg.data.incidents[0];

    return <TableRow key={msg.id}>
      <TableCell>{ incident.location.lap }</TableCell>
      <TableCell>{ incident.location.lapPct }</TableCell>
      <TableCell>{ displayTime(incident.time.time) }</TableCell>
      <TableCell>Controls</TableCell>
    </TableRow>
  }
  
  return <TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Lap</TableCell>
          <TableCell>%</TableCell>
          <TableCell>Time</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>

      <TableBody>
        { props.data.map(toRow) }
      </TableBody>
    </Table>
  </TableContainer>
}
