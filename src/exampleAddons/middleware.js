export const print1 = (storeAPI) => (next) => (action) => {
  console.log('1')
  return next(action)
}

export const print2 = (storeAPI) => (next) => (action) => {
  console.log('2')
  return next(action)
}

export const print3 = (storeAPI) => (next) => (action) => {
  console.log('3')
  return next(action)
}

export const loggerMiddlware = storeApi => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', storeApi.getState());
  return result;
}
