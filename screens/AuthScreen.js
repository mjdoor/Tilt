import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, Text } from "react-native";

import DefaultBackground from "../components/DefaultBackground";
import RoundedButton from "../components/RoundedButton";
import Login from "../components/Authentication/Login";
import Register from "../components/Authentication/Register";

const AuthScreen = props => {
  const {
    isAuthenticated,
    isPending,
    loggingInManually,
    user,
    loginError,
    errorMsg
  } = useSelector(state => state);

  const [registering, setRegistering] = useState(true);

  const switchAuthHandler = () => {
    setRegistering(!registering);
  };

  const navigateToHomePage = () => {
    props.navigation.navigate("Home");
  };
  return (
    <DefaultBackground>
      {isPending ? (
        <Text style={{ textAlign: "center" }}>Loading...</Text>
      ) : isAuthenticated && !loggingInManually ? (
        <View>
          <Text style={{ textAlign: "center", marginBottom: 15, fontSize: 20 }}>
            Welcome back {user.displayName}!
          </Text>
          <RoundedButton label="Play" onPress={navigateToHomePage} />
        </View>
      ) : (
        <View>
          {registering ? (
            <Register onComplete={navigateToHomePage} />
          ) : (
            <Login onComplete={navigateToHomePage} />
          )}
          {loginError && (
            <Text style={{ color: "red", textAlign: "center" }}>
              {errorMsg}
            </Text>
          )}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              marginTop: 30
            }}
          >
            <Text>
              {registering ? "Already registered?" : "Need to register?"}
            </Text>
            <RoundedButton
              label={registering ? "Log In" : "Register"}
              backgroundColor="rgb(10, 222, 245)"
              onPress={switchAuthHandler}
            />
          </View>
        </View>
      )}
    </DefaultBackground>
  );
};

export default AuthScreen;
