import { all } from 'redux-saga/effects';
import { watchAbout } from './sagas/about';
import { watchSettingsDatastore } from './sagas/settingsDatastore';
import { watchProfiles } from './sagas/profiles';
import { watchTeams } from './sagas/team';
import { watchForms } from './sagas/spaceForms';
import { watchSpaceApp } from './sagas/spaceApp';
import { watchSettingsUsers } from './sagas/settingsUsers';
import { watchSettingsNotifications } from './sagas/settingsNotifications';
import { watchSettingsSpace } from './sagas/settingsSpace';

export default function* sagas() {
  yield all([
    watchSpaceApp(),
    watchAbout(),
    watchSettingsDatastore(),
    watchSettingsNotifications(),
    watchProfiles(),
    watchTeams(),
    watchForms(),
    watchSettingsUsers(),
    watchSettingsSpace(),
  ]);
}
