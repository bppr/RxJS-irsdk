import React from "react";
import { Gateway } from "./Gateway";
import { DEFAULT_SYSTEM_STATE, SystemState } from "./messages";

const nullGateway = {
  play() {},
  pause() {},
  goLive() {},
  focusCar() {},
  onMsg() {},
  replay() {}
}

export const AppContext = React.createContext<{
  gateway: Gateway,
  system: SystemState,
  clearAll(): void
}>({
  gateway: nullGateway,
  system: DEFAULT_SYSTEM_STATE,
  clearAll: () => {}
});