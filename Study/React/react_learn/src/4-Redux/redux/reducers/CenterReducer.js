const CenterReducer = (
  state = {
    inpVal: "--默认值--",
  },
  action
) => {
  switch (action.type) {
    case "show-input-value":
      return { inpVal: action.value };

    default:
      return state;
  }
};

export default CenterReducer;
