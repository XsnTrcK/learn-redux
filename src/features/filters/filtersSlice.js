const initialState = {
  status: "All",
  colors: []
};

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case "filters/statusFilterChanged":
      return {
        ...state,
        status: action.payload
      };
    case "filters/colorFilterChanged":
      const { color, changeType } = action.payload;
      switch (changeType) {
        case "added":
          return {
            ...state,
            colors: [...state.colors, color]
          };
        case "removed":
          return {
            ...state,
            colors: state.colors.filter((option) => option === color)
          };
        default:
          return state;
      }
    default:
      return state;
  }
}
