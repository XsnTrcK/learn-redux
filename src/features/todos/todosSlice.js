import { client } from "../../api/client";

const initialState = [];

function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
  return maxId + 1;
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case "todos/todoAdded":
      return [...state, action.payload];
    case "todos/todoToggled":
      return state.map((todo) => {
        if (todo.id !== action.payload) {
          return todo;
        }

        return {
          ...todo,
          completed: !todo.completed
        };
      });
    case "todos/colorSelected":
      const { todoId, color } = action.payload;
      return state.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          color
        };
      });
    case "todo/todoDeleted":
      return state.filter((todo) => todo.id !== action.payload);
    case "todo/allCompleted":
      return state.map((todo) => {
        return { ...todo, completed: true };
      });
    case "todo/completedCleared":
      return state.filter((todo) => !todo.completed);
    case "todos/todosLoaded":
      return action.payload;
    default:
      return state;
  }
}

export async function fetchTodos(dispatch, getState) {
  const repsonse = await client.get('/fakeApi/todos');
  console.log('Todos before dispatch: ', getState().todos.length);
  dispatch({type: 'todos/todosLoaded', payload: repsonse.todos});
  console.log('Todos after dispatch: ', getState().todos.length);
}

export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    const initialTodo = {text};
    const repsonse = await client.post('/fakeApi/todos', {todo: initialTodo});
    dispatch({type: 'todos/todoAdded', payload: repsonse.todo});
  }
}
