import { client } from "../../api/client";
import { createSelector } from "reselect";
import { StatusFilters } from "../filters/filtersSlice";

const initialState = {
  status: 'idle', // or: 'loading', 'succeded', 'failed'
  entities: {} // {<todoId>: <todoObject>}
};

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case "todos/todoAdded":
      return{
        ...state,
        entities: {
          ...state.entities,
          [action.payload.id]: action.payload
        }
      };
    case "todos/todoToggled":
      const todo = state.entities[action.payload];
      return {
        ...state,
        entities: {
          ...state.entities,
          [todo.id]: {
            ...todo,
            completed: !todo.completed
          }
        }
      };
    case "todos/colorSelected":
      const { todoId, color } = action.payload;
      todo = state.entities[todoId];
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            color
          }
        }
      };
    case "todo/todoDeleted":
      const newEntities = {...state.entities};
      delete newEntities[action.payload]
      return {...state, entities: newEntities};
    case "todo/allCompleted":
      const newTodos = {...state.entities};
      Object.values(newTodos).forEach(todo => {
        newTodos[todo.id] = {...todo, completed: true};
      });
      return {
        ...state,
        entities: newTodos
      };
    case "todo/completedCleared":
      const todosNew = {...state.entities};
      Object.values(todosNew).forEach(todo => {
        if (todo.completed) {
          delete todosNew[todo.id];
        }
      });
      return {
        ...state,
        entities: todosNew
      };
    case "todos/todosLoaded":
      const brandNewTodos = {};
      action.payload.forEach(todo => brandNewTodos[todo.id] = todo);
      return {
        ...state,
        entities: brandNewTodos,
        status: 'idle'
      };
    case "todos/todosLoading": 
      return {
        ...state,
        status: 'loading'
      }
    default:
      return state;
  }
}

export const selectTodoEntitiess = state => state.todos.entities;

export const selectTodos = createSelector(selectTodoEntitiess, entities => Object.values(entities));

export const fetchTodos = () => async (dispatch, getState) => {
  dispatch(todosLoading());
  const repsonse = await client.get('/fakeApi/todos');
  console.log('Todos before dispatch: ', getState().todos.length);
  dispatch(todosLoaded(repsonse.todos));
  console.log('Todos after dispatch: ', getState().todos.length);
}

export const saveNewTodo = text => async (dispatch, getState) => {
  const initialTodo = {text};
  const repsonse = await client.post('/fakeApi/todos', {todo: initialTodo});
  dispatch(todoAdded(repsonse.todo));
}

export const todosLoading = () => (
  {
    type: "todos/todosLoading"
  }
)

export const todosLoaded = todos => (
  {
    type: "todos/todosLoaded",
    payload: todos
  }
);

export const todoAdded = todo => (
  {
    type: "todos/todoAdded",
    payload: todo
  }
);

export const selectTodoIds = createSelector(
  selectTodos,
  todos => todos.map(todo => todo.id)
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  state => state.filters,
  (todos, filters) => {
    const {status, colors} = filters;
    const showAllCompletions = status === StatusFilters.All;
    if (showAllCompletions && colors.length === 0) {
      return todos;
    }
    const completedStatus = status === StatusFilters.Completed;
    return todos.filter(todo => {
      const statusMatches = showAllCompletions || todo.completed === completedStatus;
      const colorMatches = colors.length === 0 || colors.includes(todo.color);
      return statusMatches && colorMatches;
    });
  }
)

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  filteredTodos => filteredTodos.map(todo => todo.id)
)

export const selectTodoById = todoId => state => (
  selectTodoEntitiess(state)[todoId]
);
