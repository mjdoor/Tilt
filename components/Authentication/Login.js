import React, { useState } from "react";
import { TextInput, View, Keyboard } from "react-native";
import { useDispatch } from "react-redux";

import { firebaseApp } from "../../firebaseconfig";

import ACTIONS from "../../redux/actions";

import RoundedButton from "../RoundedButton";
import styles from "../../styles/styles";

const Login = props => {
  const [emailAddr, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pending, setPending] = useState(false);

  const dispatch = useDispatch();

  const onLoginPress = () => {
    dispatch(ACTIONS.loginUser());
    setPending(true);
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(emailAddr, password)
      .then(res => {
        if (res.user) {
          dispatch(ACTIONS.loginUser(res.user));
          clearFields();
          props.onComplete();
        }
      })
      .catch(error => {
        setPending(false);
        Keyboard.dismiss();
        dispatch(ACTIONS.loginError(error.message));
      });
  };

  const clearErrors = () => {
    dispatch(ACTIONS.clearErrors());
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
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
      <RoundedButton label="Log In" onPress={onLoginPress} disabled={pending} />
    </View>
  );
};

export default Login;
