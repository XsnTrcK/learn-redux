import React from 'react'
import TodoListItem from './TodoListItem'
import { shallowEqual, useSelector } from 'react-redux';

const TodoList = () => {
  const todoIds = useSelector(state => state.todos.map(todo => todo.id), shallowEqual);

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
