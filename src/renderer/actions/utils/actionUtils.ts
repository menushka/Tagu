import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store/store';
import { ActionTypes, UPDATE_FILES_AND_TAGS } from '../../store/types';
import { TagsModel } from '../../models/tagsModel';
import { FileTreeHelper } from '../../helpers/fileTreeHelper';

export function dispatchUpdateFullUpdate(dispatch: ThunkDispatch<RootState, unknown, ActionTypes>, getState: () => RootState) {
  const allTags = TagsModel.instance.getTags();
  const searchFiles = FileTreeHelper.getFilteredFiles(getState().search.selectedTags);
  const tagFiles = FileTreeHelper.getFilesByTag();
  dispatch({
    type: UPDATE_FILES_AND_TAGS,
    newState: {
      allTags,
      search: {
        files: searchFiles,
      },
      tag: {
        files: tagFiles,
      },
    },
  });
}
