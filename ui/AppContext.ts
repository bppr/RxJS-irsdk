import React from "react";
import { Gateway } from "./Gateway";
import { ResolutionType, DEFAULT_SYSTEM_STATE, AppConfig, DEFAULT_APP_CONFIG } from "./components/App";
import { SystemState } from "../server/messages";

const nullGateway = {
  play() {},
  pause() {},
  goLive() {},
  focusCar() {},
  onMsg() {},
  replay() {}
}

const noop = () => {}

type Actions = {
  clearAll(): void
  resolveMessage(id: string, resolution: ResolutionType): () => void
  toggleArchivedMessages(): void
}

const nullActions: Actions = {
  clearAll() {},
  resolveMessage: () => noop,
  toggleArchivedMessages() {}
}

export const AppContext = React.createContext<{
  gateway: Gateway,
  system: SystemState,
  actions: Actions,
  config: AppConfig
}>({
  gateway: nullGateway,
  system: DEFAULT_SYSTEM_STATE,
  actions: nullActions,
  config: DEFAULT_APP_CONFIG
});