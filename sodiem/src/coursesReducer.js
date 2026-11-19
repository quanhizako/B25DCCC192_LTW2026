export const coursesReducer = (state = [], action) => {
  switch (action.type) {
    case 'LOAD':
      return [...action.payload];
    case 'ADD': {
      const nextId = state.reduce((max, c) => Math.max(max, c.id), 0) + 1;
      return [...state, { ...action.payload, id: nextId }];
    }
    case 'REMOVE':
      return state.filter((c) => c.id !== action.payload);
    case 'SET_SCORE':
      return state.map((c) =>
        c.id === action.payload.id
          ? { ...c, score: action.payload.score }
          : c
      );
    default:
      return state;
  }
};
