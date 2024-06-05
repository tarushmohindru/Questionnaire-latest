import { createStore } from "redux";

const jwtReducer = (state, action) => {
  state = action.payload;
  return state;
};

const qReducer = (state, action) => {
  state = action.payload;
  return state;
};

const gridReducer = (state, action) => {
  state = action.payload;
  return state;
};

const answerRequestReducer = (state, action) => {
  state = action.payload;
  return state;
};

const answerReducer = (state, action) => {
  state = action.payload;
  return state;
};

const scoreReducer = (state, action) => {
  state = action.payload;
  return state;
};

const bubbleReducer = (state, action) => {
  state = action.payload;
  return state;
};

export const jwtStore = createStore(jwtReducer);
export const qStore = createStore(qReducer);
export const gridStore = createStore(gridReducer);
export const answerStore = createStore(answerRequestReducer);
export const solnStore = createStore(answerReducer);
export const scoreStore = createStore(scoreReducer);
export const bubbleStore = createStore(bubbleReducer);
