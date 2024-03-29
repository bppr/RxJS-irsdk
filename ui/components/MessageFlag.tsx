import React, { useContext } from 'react';
import { Avatar, ButtonGroup, Card, CardHeader, IconButton } from '@mui/material';
import { Search, Clear, Flag as FlagIcon } from '@mui/icons-material';
import { AppContext } from '../AppContext';
import { FlagMsg } from "./App";
import { Flag } from 'server/messages';
import { displayTime } from '../utils/displayTime';
import _ from 'lodash';

export function MessageFlag({ message }: { message: FlagMsg; }) {
  const { gateway, actions } = useContext(AppContext);

  const data = message.data;

  function replay({ time, car }: Flag) {
    return () => gateway.replay(time.index, time.time, car.number);
  }

  const headerProps = {
    title: `#${data[0].car.number} ${data[0].car.driver}`,
    subheader: `Flag ${data.flatMap(d=>d.flags).map(_.capitalize).join(', ')} / ${displayTime(data[0].time.time)}`,
    avatar: <Avatar><FlagIcon /></Avatar>,
    style: { opacity: message.archived ? 0.5 : 1 },
    action: <ButtonGroup size="large">
      <IconButton title="Show Replay" onClick={replay(data[0])}>
        <Search />
      </IconButton>

      <IconButton title="Dismiss" onClick={actions.resolveMessage(message.id, 'dismissed')}>
        <Clear />
      </IconButton>
    </ButtonGroup>
  };

  return <Card>
    <CardHeader {...headerProps} />
  </Card>;
}
