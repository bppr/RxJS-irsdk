import React, { useContext, useState } from 'react';
import _ from 'lodash';
import { IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { FormatListNumbered, History, HistoryRounded, KeyboardArrowRight, Numbers, RemoveRoad, Videocam, VideogameAssetOff } from '@mui/icons-material';
import { IncidentMsg, MessageItem } from "./App";
import { CarDetail } from './CarDetail';
import { AppContext } from '../AppContext';
import { CarState } from 'server/state';

export function CarSummary(props: { messages: MessageItem[] }) {
  const incidents = props.messages.filter(m => m.type === 'incident') as IncidentMsg[];
  const carIncidents = _.groupBy(incidents, 'data.car.number');

  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  const selectCar = (number: string) => () => setSelectedCar(number);
  const unselectCar = () => setSelectedCar(null);

  const [sortBy, setSortBy] = useState<CarSortBy>('recent');
  const setSort = (val: CarSortBy) => () => setSortBy(val)

  return <Stack spacing={2} style={{minWidth: '40%'}}>
    <Typography variant="h4">
      { selectedCar ? 'Driver Detail' : 'Driver Summary' }
    </Typography>

    { 
      selectedCar 
        ? <CarDetail unselectCar={unselectCar} incidents={carIncidents[selectedCar]} /> 
        : <CarTable incidents={carIncidents} selectCar={selectCar} setSort={setSort} sortBy={sortBy} />
    }
  </Stack>
}

type CarSortBy = 'recent' | 'position' | 'number' | 'off-track' | 'loc';

type CarTableProps = {
  incidents: { [number: string]: IncidentMsg[] };
  selectCar(num: string): () => void;
  setSort(string: CarSortBy): () => void;
  sortBy: CarSortBy;
};

function sort(cars: CarState[], sortBy: CarSortBy, incidents: { [num: string]: IncidentMsg[] }) {
  if(sortBy === 'number' || sortBy === 'position')
    return _.sortBy(cars, sortBy);

  if(sortBy === 'recent') {
    const lastIncidentCounted = (car: CarState) => _.last(incidents[car.number]?.filter(i => i.archived))
    return _.orderBy(cars, car => lastIncidentCounted(car)?.data.time.time ?? 0, 'desc');
  }

  if(sortBy === 'off-track')
    return _.orderBy(cars, car => incidents[car.number]?.filter(m => m.resolution === 'off-track').length ?? 0, 'desc')

  if(sortBy === 'loc')
    return _.orderBy(cars, car => incidents[car.number]?.filter(m => m.resolution === 'loc').length ?? 0, 'desc')

  return cars;
}

const carTableSortButtons = [
  { title: "Recent Incident", key: "recent", icon: History },
  { title: "Position", key: "position", icon: FormatListNumbered },
  { title: "Car #", key: "number", icon: Numbers },
  { title: "Incident Count", key: "off-track", icon: RemoveRoad },
  { title: "LOC Count", key: "loc", icon: VideogameAssetOff }
]

export function CarTable({ incidents, selectCar, setSort, sortBy }: CarTableProps) {
  const { system } = useContext(AppContext);
  
  const cars = sort(system.cars, sortBy, incidents);
  
  return <div>
    { 
      carTableSortButtons.map(b => <IconButton key={b.key} title={`Sort by ${b.title}`} onClick={setSort(b.key as CarSortBy)}>
        { <b.icon style={{opacity: sortBy === b.key ? 1.0 : 0.5}} /> }
      </IconButton>)
    }

    <TableContainer>
      <Table aria-label="Car Summary">

      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Car #</TableCell>
          <TableCell>Position</TableCell>
          <TableCell>Driver</TableCell>
          <TableCell>Off-Tracks</TableCell>
          <TableCell>LOCs</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>

      <TableBody>
        { cars.map(car => <CarTableRow 
            key={car.number} 
            car={car} 
            incidents={incidents[car.number] ?? []} 
            onSelect={selectCar(car.number)} />) }
      </TableBody>

      </Table>
    </TableContainer>
  </div>
}


function CarTableRow({ car, incidents, onSelect }: { incidents: IncidentMsg[], onSelect: () => void, car: CarState }) {
  const { gateway } = useContext(AppContext);
  
  const offTracks = incidents.filter(m => m.resolution === 'off-track');
  const locs = incidents.filter(m => m.resolution === 'loc');

  function showCar() {
    gateway.focusCar(car.number);
    gateway.goLive();
  }

  return <React.Fragment>
    <TableRow>
      <TableCell>
        <IconButton title="Show Car" size="small" onClick={showCar}>
          <Videocam />
        </IconButton>
      </TableCell>
      <TableCell>{ car.number }</TableCell>
      <TableCell>{ car.position }</TableCell>
      <TableCell>{ car.driver.name }</TableCell>
      <TableCell>{ offTracks.length }</TableCell>
      <TableCell>{ locs.length }</TableCell>
      <TableCell>
        <IconButton title="Expand" size="small" onClick={onSelect}>
          <KeyboardArrowRight />
        </IconButton>
      </TableCell>

    </TableRow>
  </React.Fragment>;
}
