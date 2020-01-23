import { InitializationState } from 'src/geth/reducer'

export enum Actions {
  SET_INIT_STATE = 'GETH/SET_INIT_STATE',
  SET_GETH_CONNECTED = 'GETH/SET_GETH_CONNECTED',
  CANCEL_GETH_SAGA = 'GETH/CANCEL_GETH_SAGA',
  SET_PROMPT_ZERO_SYNC = 'GETH/SET_PROMPT_ZERO_SYNC',
}

interface SetInitState {
  type: Actions.SET_INIT_STATE
  state: InitializationState
}

export const setInitState = (state: InitializationState): SetInitState => ({
  type: Actions.SET_INIT_STATE,
  state,
})

export const cancelGethSaga = () => ({
  type: Actions.CANCEL_GETH_SAGA,
})

interface SetPromptZeroSync {
  type: Actions.SET_PROMPT_ZERO_SYNC
  promptIfNeeded: boolean
}

export const setPromptZeroSync = (promptIfNeeded: boolean): SetPromptZeroSync => ({
  type: Actions.SET_PROMPT_ZERO_SYNC,
  promptIfNeeded,
})

interface SetGethConnected {
  type: Actions.SET_GETH_CONNECTED
  connected: boolean
}

export const setGethConnected = (connected: boolean): SetGethConnected => ({
  type: Actions.SET_GETH_CONNECTED,
  connected,
})

export type ActionTypes = SetInitState | SetGethConnected | SetPromptZeroSync
