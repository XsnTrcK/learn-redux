import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer";
import {loggerMiddlware} from './exampleAddons/middleware';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

let preloadedState;
const persistedTodoString = localStorage.getItem('todos');
if (persistedTodoString) {
    preloadedState = {
        todos: JSON.parse(persistedTodoString)
    };
}

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddlware));

const store = createStore(rootReducer, preloadedState, composedEnhancer);

export default store;