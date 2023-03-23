import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Flag, IncidentGroup, SystemState } from 'server/messages';

import { AppContext } from '../AppContext';
import { Gateway } from '../Gateway';

import { randomId } from '../utils/randomId';
import { testIncidents, testSystem } from '../utils/testdata';
import { update } from '../utils/update';

import { CarSummary } from './CarSummary';
import Header from './Header';
import MessageFeed from './MessageFeed';

export type ResolutionType = 'dismissed' | 'off-track' | 'loc';

export type Message<T, Data> = {
  id: string;
  type: T;
  data: Data;
  archived: boolean;
  resolution?: ResolutionType;
};

export type IncidentMsg = Message<'incident', IncidentGroup>
export type FlagMsg = Message<'flag', Flag[]>
export type MessageItem = IncidentMsg | FlagMsg;

export const DEFAULT_SYSTEM_STATE: SystemState = {
  session: { index: 0, time: 0, type: "Unknown" },
  replayState: { session: 0, time: 0 },
  cameraState: { isPaused: true, car: { driver: 'None', number: '---' } },
  cars: []
};

export type AppConfig = {
  showArchivedMessages: boolean
}

export const DEFAULT_APP_CONFIG = { showArchivedMessages: false };

export function App({ gateway }: { gateway: Gateway }) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);
  const [system, setSystem] = useState<SystemState>(DEFAULT_SYSTEM_STATE);

  function receiveMessage(message: any) {
    if (message.type !== 'system')
      console.log(message);

    if (message.type === 'system')
      setSystem(message.data);

    if (['incident', 'flag'].includes(message.type))
      setMessages(prev => [...prev, { ...message, archived: false, id: randomId() }]);
  }

  function updateMessage(id: string, values: Partial<MessageItem>) {
    const index = messages.findIndex(m => m.id === id)

    if(index === -1) return

    setMessages(update(messages, index, values));
  }

  const actions = {
    clearAll() {
      if (window.confirm("Are you sure you want to clear all messages?")) {
        setMessages([]);
      }
    },

    resolveMessage(id: string, resolution: ResolutionType) {
      return () => updateMessage(id, { resolution, archived: true });
    },

    unresolveMessage(id: string) {
      return () => updateMessage(id, { resolution: undefined, archived: false })
    },

    toggleArchivedMessages() {
      setConfig(prev => ({...prev, showArchivedMessages: !prev.showArchivedMessages }))
    }
  };

  useEffect(() => gateway.onMsg(receiveMessage), []);

  return <AppContext.Provider value={{ gateway, system, actions, config }}>
    <Stack spacing={4}>
      <Header />

      <Stack direction="row" spacing={4}>
        <MessageFeed messages={messages} />
        <CarSummary messages={messages} />
      </Stack>
    </Stack>
  </AppContext.Provider>;
}
