mport { AddItemForm } from './../components/ui/addItemForm/AddItemForm';
import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography
} from '@material-ui/core';


const TodolistsList: React.FC<TodolistsListPropsType> = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTodolistsTC());
  }, []);

  let todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todoLists
  );
  let tasks = useSelector<AppRootStateType, TaskStateType>(
    (state) => state.tasks
  );

  const changeTaskStatus = useCallback(
    (taskID: string, status: TaskStatuses, todolistId: string) => {
      dispatch(updateTaskTC(taskID, todolistId, { status }));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (taskID: string, title: string, todolistId: string) => {
      dispatch(updateTaskTC(taskID, todolistId, { title }));
    },
    [dispatch]
  );

  const addTask = useCallback(
    (newTitle: string, todolistId: string) => {
      const thunk = addTaskTC(newTitle, todolistId);
      dispatch(thunk);
    },
    [dispatch]
  );
  const removeTasks = useCallback(
    (taskID: string, todolistId: string) => {
      const thunk = removeTaskTC(taskID, todolistId);
      dispatch(thunk);
    },
    [dispatch]
  );

  const removeTodoList = useCallback(
    (todolistId: string) => {
      dispatch(removeTodolistTC(todolistId));
    },
    [dispatch]
  );
  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );
  const changeTodoListTitle = useCallback(
    (title: string, todolistId: string) => {
      dispatch(changeTodolistTitleTC(title, todolistId));
    },
    [dispatch]
  );

  const changeTodoListFilter = useCallback(
    (key: FilterValueType, todolistId: string) => {
      const action = changeTodolistFilterAC(key, todolistId);
      dispatch(action);
    },
    [dispatch]
  );

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodoList} />
      </Grid>
      <Grid container spacing={5}>
        {todolists.map((tl) => {
         return <Grid item key={tl.id}>
            <Paper style={{ padding: '10px' }} elevation={5}>
              <Todolist
                todolistId={tl.id}
                title={tl.title}
                tasks={tasks[tl.id]}
                removeTasks={removeTasks}
                addTask={addTask}
                changeTodoListFilter={changeTodoListFilter}
                changeTaskStatus={changeTaskStatus}
                removeTodoList={removeTodoList}
                filter={tl.filter}
                changeTaskTitle={changeTaskTitle}
                changeTodoListTitle={changeTodoListTitle}
              />
            </Paper>
          </Grid>;
        })}
      </Grid>
    
    </>
  );
};