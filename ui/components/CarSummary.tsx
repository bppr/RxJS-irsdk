import React, { useState } from 'react';
import _ from 'lodash';
import { IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';
import { IncidentMsg, MessageItem } from "./App";
import { CarDetail } from './CarDetail';

export function CarSummary(props: { messages: MessageItem[] }) {
  const incidents = props.messages.filter(m => m.type === 'incident') as IncidentMsg[];
  const cars = _.groupBy(incidents, 'data.car.number');

  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const selectCar = (number: string) => () => setSelectedCar(number);
  const unselectCar = () => setSelectedCar(null);

  return <Stack spacing={2} style={{minWidth: '40%'}}>
    <Typography variant="h4">
      { selectedCar ? 'Driver Detail' : 'Driver Summary' }
    </Typography>

    { 
      selectedCar 
        ? <CarDetail unselectCar={unselectCar} incidents={cars[selectedCar]} /> 
        : <CarTable cars={cars} selectCar={selectCar} /> 
    }
  </Stack>
}

export function CarTable({ cars, selectCar }: { cars: { [number: string]: IncidentMsg[] }, selectCar(num: string): () => void }) {
  return <TableContainer>
    <Table aria-label="Car Summary">

    <TableHead>
      <TableRow>
        <TableCell>Car #</TableCell>
        <TableCell>Driver</TableCell>
        <TableCell>Off-Tracks</TableCell>
        <TableCell>LOCs</TableCell>
        <TableCell />
      </TableRow>
    </TableHead>

    <TableBody>
      { _.map(cars, (ms, key) => <CarTableRow selectDriver={selectCar(key)} key={key} messages={ms} />) }
    </TableBody>

    </Table>
  </TableContainer>
}

function CarTableRow({ messages, selectDriver }: { messages: IncidentMsg[], selectDriver: () => void }) {
  const car = messages[0].data.car;
  const offTracks = messages.filter(m => m.resolution === 'off-track');
  const locs = messages.filter(m => m.resolution === 'loc');

  const onClickHandler = (ev: React.MouseEvent<any>) => {
    ev.preventDefault();
    ev.stopPropagation();
    selectDriver()
  }

  return <React.Fragment>
    <TableRow>
      <TableCell>{ car.number }</TableCell>
      <TableCell>{ car.driver.name }</TableCell>
      <TableCell>{ offTracks.length }</TableCell>
      <TableCell>{ locs.length }</TableCell>
      <TableCell>
        <IconButton aria-label="Expand" size="small" onClick={onClickHandler}>
          <KeyboardArrowRight />
        </IconButton>
      </TableCell>

    </TableRow>
  </React.Fragment>;
}
