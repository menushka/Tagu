import {
  READ_PREFERENCES_FILE,
  WRITE_PREFERENCES_FILE,
} from '../../store/types';
import { IPreferences, Preferences } from '../../persistent/preferences';
import { AppThunk } from '../../store/store';
import { Database } from '../../db/database';
import { dispatchUpdateFullUpdate } from '../utils/actionUtils';

export const readPreferencesFile = (): AppThunk => async (dispatch, getState) => {
  const preferences = Preferences.read();
  Database.instance.init(preferences.dataPath);
  dispatch({
    type: READ_PREFERENCES_FILE,
    preferences,
  });
  dispatchUpdateFullUpdate(dispatch, getState);
};

export const writePreferencesFile = (preferences: IPreferences): AppThunk => async (dispatch, getState) => {
  Preferences.write(preferences);
  Database.instance.switch(preferences.dataPath);
  dispatch({
    type: WRITE_PREFERENCES_FILE,
    preferences,
  });
  dispatchUpdateFullUpdate(dispatch, getState);
};
