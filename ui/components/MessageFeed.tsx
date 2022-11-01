import React, { useContext } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';
import { Close, Archive, Unarchive } from '@mui/icons-material';

import { MessageIncident } from './MessageIncident';
import { AppContext } from '../AppContext';
import { AppConfig, MessageItem } from "./App";

export default function MessageFeed(props: { messages: MessageItem[]; }) {
  const { actions, config } = useContext(AppContext);

  return <Stack spacing={1} style={{minWidth: '30%'}}>
    <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
      <Typography variant="h4">Incident Feed</Typography>

      <IconButton title="Clear Incidents" onClick={actions.clearAll}>
        <Close />
      </IconButton>

      <IconButton title="Toggle Archived Incidents" onClick={actions.toggleArchivedMessages}>
        { config.showArchivedMessages ? <Archive/> : <Unarchive />}
      </IconButton>
    </Stack>

    { props.messages.map(displayMessage(config)) }
    
  </Stack>
}

function displayMessage(config: AppConfig) {
  return (msg: MessageItem) => {
    if (!config.showArchivedMessages && msg.archived) 
      return null;

    if (msg.type === "incident")
      return <MessageIncident key={msg.id} message={msg} />
    
    if (msg.type === "flag")
      return <h3>FLAG</h3>

    return <></>;
  }
}