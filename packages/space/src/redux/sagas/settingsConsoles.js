import { call, put, select, takeEvery } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { actions as systemErrorActions } from '../modules/errors';
import { actions, types } from '../modules/settingsConsoles';

export function* fetchConsolesSaga() {
  const kapps = yield select(state => state.app.kapps);
  const adminKapp = kapps.find(kapp => kapp.slug === 'admin');
  if (adminKapp) {
    const { forms, errors, serverError } = yield call(CoreAPI.fetchForms, {
      kappSlug: adminKapp.slug,
      include: 'attributes',
    });

    if (serverError) {
      yield put(systemErrorActions.setSystemError(serverError));
    } else if (errors) {
      yield put(actions.setConsolesErrors(errors));
    } else {
      yield put(actions.setConsoles(forms));
    }
  } else {
    yield put(actions.setConsoles([]));
  }
}

export function* watchSettingsConsoles() {
  yield takeEvery(types.FETCH_CONSOLES, fetchConsolesSaga);
}
