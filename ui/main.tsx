import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Grid, Stack } from '@mui/material';

import { Gateway, wrappedSocket } from './Gateway';
import { AppContext } from './AppContext';

import Header from './Header';
import Feed from './Feed';
import CarTable from './CarTable';

import { testIncidents } from './testdata';
import { IncidentGroup, DEFAULT_SYSTEM_STATE, SystemState } from './messages';
import { Flag } from 'server/flags';

const PORT = 3001;

type Message<T, Data> = {
  type: T,
  data: Data
}

type MessageItem = Message<"incident", IncidentGroup> | Message<"flag", Flag>

function App({ gateway }: { gateway: Gateway }) {
  const [incidents, setIncidents] = useState<IncidentGroup[]>(testIncidents);
  const [system, setSystem] = useState<SystemState>(DEFAULT_SYSTEM_STATE);

  function clearAll() {
    if(window.confirm("Are you sure?")) setIncidents([])
  }

  function receiveMessage(message: any) {
    if(message.type !== 'system')
      console.log(message);

    if(message.type === 'incident') 
      setIncidents(prev => [...prev, message.data])
    
    if(message.type === 'system')
      setSystem(message.data)
  }
  
  useEffect(() => gateway.onMsg(receiveMessage), []);

  return <AppContext.Provider value={{ gateway, system, clearAll }}>
    <Stack>
      <Header />
      
      <Grid container spacing={2}>
        <Feed incidents={incidents} />
        <CarTable incidents={incidents} />
      </Grid>
    </Stack>
  </AppContext.Provider>;
}

function main() {
  const container = document.getElementById('app');
  const root = createRoot(container!);
  const gateway = wrappedSocket(PORT);
  
  root.render(<App gateway={gateway} />);
}

main()