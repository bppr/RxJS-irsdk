import React from 'react';
import { AltRoute, Clear, NearbyError, RemoveRoad, Search, VideogameAssetOff, Warning } from '@mui/icons-material';
import { Avatar, ButtonGroup, Card, CardHeader, IconButton, SvgIcon } from '@mui/material';

import { displayTime } from './displayTime';
import { IncidentGroup } from "./messages";

export function IncidentDisplay({ incident }: { incident: IncidentGroup }) {
  const type = getPrimaryType(incident),
    avatar = <Avatar sx={{ color: "black" }} alt={type}>{ getIncidentIcon(incident, type) }</Avatar>

  const props = {
    title: `#${incident.car.number} ${incident.car.driver.name}`,
    subheader: `${type} / ${displayTime(incident.time.time)}`,
    avatar,
    action: <ButtonGroup size="large">
      <IconButton title="Show Replay">
        <Search />
      </IconButton>

      <IconButton title="Count Off-Track">
        <RemoveRoad />
      </IconButton>
      
      <IconButton title="Count Loss of Control">
        <VideogameAssetOff />
      </IconButton>
      
      <IconButton title="Dismiss">
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
  if(types.includes("Unsafe Rejoin")) return "Unsafe Rejoin";
  
  return "xCount";
}

function getIncidentIcon(incident: IncidentGroup, type: string) {
  return {
    "Caution": <Warning color="warning" />,
    "Track Limits": <AltRoute color="primary" />,
    "Unsafe Rejoin": <NearbyError color="warning" />,
  }[type] ?? <SvgIcon>
    <text dx="-1" dy="20" color="white">{ incident.xCount }x</text>
  </SvgIcon>
}