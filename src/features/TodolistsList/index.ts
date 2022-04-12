import * as tasksActions from "./tasks-actions";
import * as todolistsAsyncActions from "./todolists-actions";
import { slice } from "./todolistsReducer";

const todolistsActions = {
  ...todolistsAsyncActions,
  ...slice.actions,
};

export { tasksActions, todolistsActions };
