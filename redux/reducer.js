import ACTIONS from "./actions";

const intitialState = {
  isAuthenticated: false,
  loggingInManually: false,
  loginError: false,
  isPending: false,
  errorMsg: "",
  user: {},
  highscore: null
};

export default (state = intitialState, action) => {
  switch (action.type) {
    case ACTIONS.Types.AUTHENTICATE_USER:
      return {
        ...state,
        loginError: false,
        isAuthenticated: true,
        user: action.user
      };
    case ACTIONS.Types.LOGIN_USER:
      return {
        ...state,
        loginError: false,
        loggingInManually: true
      };
    case ACTIONS.Types.DEAUTHENTICATE_USER:
      return {
        ...state,
        loginError: false,
        isAuthenticated: false,
        user: {}
      };
    case ACTIONS.Types.LOGIN_ERROR:
      return {
        ...state,
        loginError: true,
        isPending: false,
        isAuthenticated: false,
        errorMsg: action.errorMsg
      };
    case ACTIONS.Types.CLEAR_ERRORS:
      return { ...state, loginError: false, errorMsg: "" };
    case ACTIONS.Types.PENDING_AUTH:
      return {
        ...state,
        isPending: true
      };
    case ACTIONS.Types.CANCEL_PENDING:
      return {
        ...state,
        isPending: false
      };
    case ACTIONS.Types.SET_HIGHSCORE:
      return {
        ...state,
        highscore: action.highscore,
        highscoreDate: action.date
      };
    default:
      return state;
  }
};
