const initialState = [
  { id: 0, text: "Learn React", completed: true },
  { id: 0, text: "Learn Redux", completed: false, color: "purple" },
  { id: 0, text: "Build something fun!", completed: false, color: "blue" }
];

function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
  return maxId + 1;
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case "todos/todoAdded":
      return [
        ...state,
        {
          id: nextTodoId(state),
          text: action.payload,
          completed: false
        }
      ];
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
    default:
      return state;
  }
}
