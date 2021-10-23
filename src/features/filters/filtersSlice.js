export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

const initialState = {
  status: StatusFilters.All,
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
      const {colors} = state;
      switch (changeType) {
        case "added":
          if (colors.includes(color)) {
            return state;
          }
          return {
            ...state,
            colors: [...colors, color]
          };
        case "removed":
          return {
            ...state,
            colors: colors.filter((option) => option === color)
          };
        default:
          return state;
      }
    default:
      return state;
  }
}
