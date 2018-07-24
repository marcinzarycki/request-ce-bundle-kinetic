import { all } from 'redux-saga/effects';
import { watchAbout } from './sagas/about';
import { watchSettingsConsoles } from './sagas/settingsConsoles';
import { watchSettingsDatastore } from './sagas/settingsDatastore';
import { watchProfiles } from './sagas/profiles';
import { watchTeams } from './sagas/team';
import { watchForms } from './sagas/spaceForms';
import { watchSpaceApp } from './sagas/spaceApp';
import { watchSettingsUsers } from './sagas/settingsUsers';
import { watchSettingsNotifications } from './sagas/settingsNotifications';
import { watchSettingsRobots } from './sagas/settingsRobots';
import { watchSettingsSpace } from './sagas/settingsSpace';

export default function* sagas() {
  yield all([
    watchSpaceApp(),
    watchAbout(),
    watchSettingsConsoles(),
    watchSettingsDatastore(),
    watchSettingsNotifications(),
    watchSettingsRobots(),
    watchProfiles(),
    watchTeams(),
    watchForms(),
    watchSettingsUsers(),
    watchSettingsSpace(),
  ]);
}
