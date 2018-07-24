import { List, Record } from 'immutable';
import { Utils } from 'common';

const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_CONSOLES: namespace('settingsConsoles', 'FETCH_CONSOLES'),
  SET_CONSOLES: namespace('settingsRobots', 'SET_CONSOLES'),
  SET_FETCH_CONSOLES_ERROR: namespace(
    'settingsRobots',
    'SET_FETCH_CONSOLES_ERROR',
  ),
};

export const actions = {
  fetchConsoles: noPayload(types.FETCH_CONSOLES),
  setConsoles: withPayload(types.SET_CONSOLES),
  setFetchConsolesError: withPayload(types.SET_FETCH_CONSOLES_ERROR),
};

export const State = Record({
  loading: true,
  errors: [],
  consoles: new List(),
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_CONSOLES:
      return state.set('loading', true).set('errors', []);
    case types.SET_CONSOLES:
      return state
        .set('loading', false)
        .set('errors', [])
        .set(
          'consoles',
          List(payload).filter(form => form.type === 'Settings Console'),
        );
    case types.SET_FETCH_CONSOLES_ERROR:
      return state.set('loading', false).set('errors', payload);
    default:
      return state;
  }
};
