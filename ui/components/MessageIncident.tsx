import React, { useContext } from 'react';
import { AltRoute, Clear, RemoveRoad, Search, VideogameAssetOff, Warning } from '@mui/icons-material';
import { Avatar, ButtonGroup, Card, CardHeader, IconButton, SvgIcon } from '@mui/material';

import { displayTime } from '../utils/displayTime';
import { IncidentGroup } from "server/messages";
import { IncidentMsg } from "./App";
import { AppContext } from '../AppContext';

export function MessageIncident({ message }: { message: IncidentMsg }) {
  const incident = message.data;

  const { gateway, actions } = useContext(AppContext);

  function replay({ time, car }: IncidentGroup) {
    return () => gateway.replay(time.index, time.time, car.number)
  }

  const type = getPrimaryType(incident),
    avatar = <Avatar sx={{ color: "black" }} alt={type}>{ getIncidentIcon(incident, type) }</Avatar>

  const props = {
    title: `#${incident.car.number} ${incident.car.driver.name}`,
    subheader: `${type} / ${displayTime(incident.time.time)}`,
    avatar,
    style: { opacity: message.archived ? 0.5 : 1},
    action: <ButtonGroup size="large">
      <IconButton title="Show Replay" onClick={replay(incident)}>
        <Search />
      </IconButton>
    
      <IconButton title="Count Off-Track" onClick={actions.resolveMessage(message.id, 'off-track')}>
        <RemoveRoad />
      </IconButton>
      
      <IconButton title="Count Loss of Control" onClick={actions.resolveMessage(message.id, 'loc')}>
        <VideogameAssetOff />
      </IconButton>
      
      <IconButton title="Dismiss" onClick={actions.resolveMessage(message.id, 'dismissed')}>
        <Clear />
      </IconButton>
    </ButtonGroup>
  }

  return <Card>
    <CardHeader {...props } />
  </Card>;
}

function getPrimaryType(incident: IncidentGroup) { 
  const types = incident.types;
  
  if(types.includes("Caution")) return "Caution";
  if(types.includes("Unsafe Rejoin")) return "+ Unsafe Rejoin";
  
  return "xCount";
}

function getIncidentIcon(incident: IncidentGroup, type: string) {
  const xText = <text dx="-1" dy="20" color="white">{ incident.xCount }x</text>;
  
  return {
    "Caution": <Warning color="warning" />,
    "Track Limits": <AltRoute color="primary" />,
    "Unsafe Rejoin": <SvgIcon color="warning">{ xText }</SvgIcon>,
  }[type] ?? <SvgIcon>{ xText }</SvgIcon>
}