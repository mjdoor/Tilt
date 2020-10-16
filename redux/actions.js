import { firebaseApp, firestore } from "../firebaseconfig";

const Types = {
  LOGIN_USER: "LOGIN_USER",
  AUTHENTICATE_USER: "AUTHENTICATE_USER",
  DEAUTHENTICATE_USER: "DEAUTHENTICATE_USER",
  LOGIN_ERROR: "LOGIN_ERROR",
  PENDING_AUTH: "PENDING_AUTH",
  CANCEL_PENDING: "CANCEL_PENDING",
  SET_HIGHSCORE: "SET_HIGHSCORE",
  CLEAR_ERRORS: "CLEAR_ERRORS"
};

const pendingAuth = () => {
  return { type: Types.PENDING_AUTH };
};
const cancelPending = () => {
  return { type: Types.CANCEL_PENDING };
};

const loginUser = () => {
  return { type: Types.LOGIN_USER };
};
const authenticateUser = user => {
  return { type: Types.AUTHENTICATE_USER, user: user };
};

const deauthenticateUser = () => {
  return { type: Types.DEAUTHENTICATE_USER };
};

const loginError = msg => {
  return { type: Types.LOGIN_ERROR, errorMsg: msg };
};

const clearErrors = () => {
  return { type: Types.CLEAR_ERRORS };
};

const setHighscore = (score, date) => {
  return { type: Types.SET_HIGHSCORE, highscore: score, date: date };
};

const verifyAuth = () => dispatch => {
  dispatch(pendingAuth());
  firebaseApp.auth().onAuthStateChanged(user => {
    if (user !== null) {
      dispatch(authenticateUser(user));

      firestore
        .collection("highscores")
        .doc(user.uid)
        .onSnapshot(querySnapshot => {
          if (querySnapshot.data()) {
            dispatch(
              setHighscore(
                querySnapshot.data().highscore,
                querySnapshot.data().date
              )
            );
          }
        });
    } else {
      dispatch(deauthenticateUser());
    }
    dispatch(cancelPending());
  });
};

export default {
  verifyAuth,
  loginUser,
  authenticateUser,
  loginError,
  clearErrors,
  pendingAuth,
  cancelPending,
  setHighscore,
  Types
};
