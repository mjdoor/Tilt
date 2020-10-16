import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

import RoundedButton from "../components/RoundedButton";
import DefaultBackground from "../components/DefaultBackground";
import { firebaseApp } from "../firebaseconfig";
import IconButton from "../components/IconButton";

const HomeScreen = props => {
  const { user, highscore } = useSelector(state => state);

  const logout = () => {
    firebaseApp
      .auth()
      .signOut()
      .then(() => {
        props.navigation.navigate("Authentication");
      })
      .catch(error => {
        console.log("ERROR LOGGING OUT: " + error.message);
      });
  };
  return (
    <DefaultBackground
      absoluteComponent={
        <IconButton
          icon="md-information"
          color="rgb(0,200,50)"
          style={{ position: "absolute", top: 30, right: 10 }}
          onPress={() => props.navigation.navigate("Instructions")}
        />
      }
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Welcome {user.displayName}
      </Text>
      <View
        style={{
          marginVertical: 20,
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <Text
            style={{
              textAlign: "center",
              borderBottomWidth: 1,
              borderBottomColor: "grey"
            }}
          >
            Current High Score
          </Text>
        </View>
        <Text style={{ textAlign: "center" }}>{highscore}</Text>
      </View>

      <RoundedButton
        label="New Game"
        onPress={() =>
          props.navigation.navigate("Gameplay", { highscore: highscore })
        }
      />
      <RoundedButton
        label="View High Scores"
        onPress={() => props.navigation.navigate("Highscores")}
      />
      <RoundedButton label="Logout" onPress={logout} />
    </DefaultBackground>
  );
};

export default HomeScreen;
