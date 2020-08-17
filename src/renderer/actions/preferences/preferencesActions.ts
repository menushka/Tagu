import { ActionTypes, OPEN_PREFERENCES, CLOSE_PREFERENCES } from '../../store/types';

export const openPreferences = (): ActionTypes => ({
  type: OPEN_PREFERENCES,
});

export const closePreferences = (): ActionTypes => ({
  type: CLOSE_PREFERENCES,
});
