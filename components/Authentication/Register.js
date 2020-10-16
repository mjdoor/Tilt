import React, { useState } from "react";
import { TextInput, View, Keyboard } from "react-native";
import { useDispatch } from "react-redux";
import dateFormat from "dateformat";

import { firebaseApp, firestore } from "../../firebaseconfig";

import ACTIONS from "../../redux/actions";

import RoundedButton from "../RoundedButton";
import styles from "../../styles/styles";

const Register = props => {
  const [username, setUsername] = useState("");
  const [emailAddr, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pending, setPending] = useState(false);

  const dispatch = useDispatch();

  const onRegisterPress = () => {
    if (username === "") {
      dispatch(ACTIONS.loginError("Username cannot be blank."));
      Keyboard.dismiss();
      return;
    }
    dispatch(ACTIONS.loginUser());
    setPending(true);
    // make sure username is available before creating user. Usernames are stored in the highscores collection, so just use that
    firestore
      .collection("highscores")
      .where("username", "==", username)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return true;
        } else {
          throw new Error(
            "That usename is unavailable. Please choose a different username."
          );
        }
      })
      .then(() => {
        return firebaseApp
          .auth()
          .createUserWithEmailAndPassword(emailAddr, password);
      })
      .then(res => {
        if (res.user) {
          res.user.updateProfile({
            displayName: username
          });

          return res.user;
        }
      })
      .then(user => {
        return firestore
          .collection("highscores")
          .doc(user.uid)
          .set({
            username: username,
            highscore: 0,
            date: dateFormat(Date.now(), "mmmm d, yyyy")
          });
      })
      .then(() => {
        clearFields();
        props.onComplete();
      })
      .catch(error => {
        Keyboard.dismiss();
        setPending(false);
        dispatch(ACTIONS.loginError(error.message));
      });
  };

  const clearErrors = () => {
    dispatch(ACTIONS.clearErrors());
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setPending(false);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={emailAddr}
        onChangeText={v => setEmail(v)}
        onFocus={clearErrors}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={v => setPassword(v)}
        onFocus={clearErrors}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={v => setUsername(v)}
        onFocus={clearErrors}
      />
      <RoundedButton
        label="Register"
        onPress={onRegisterPress}
        disabled={pending}
      />
    </View>
  );
};

export default Register;
