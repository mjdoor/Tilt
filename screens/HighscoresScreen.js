import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import DefaultBackground from "../components/DefaultBackground";
import { firestore } from "../firebaseconfig";
import { FlatList } from "react-native-gesture-handler";

const HighscoresScreen = props => {
  const { user, highscore, highscoreDate } = useSelector(state => state);
  const [allHighscores, setAllHighscores] = useState([]);

  useEffect(() => {
    firestore
      .collection("highscores")
      .orderBy("highscore", "desc")
      .limit(10)
      .onSnapshot(querySnapshot => {
        let topScores = querySnapshot.docs.map((doc, idx) => {
          return {
            key: doc.id,
            username: doc.data().username,
            highscore: doc.data().highscore,
            date: doc.data().date
          };
        });
        if (topScores.find(el => el.key === user.uid) === undefined) {
          topScores.push({
            key: user.uid,
            username: user.displayName,
            highscore: highscore,
            date: highscoreDate
          });
        }
        setAllHighscores(topScores);
      });
  }, []);

  return (
    <DefaultBackground>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1
        }}
      >
        <Text style={{ width: "33%", textAlign: "left" }}>Username</Text>
        <Text style={{ width: "33%", textAlign: "center" }}>High Score</Text>
        <Text style={{ width: "33%", textAlign: "right" }}>Date Achieved</Text>
      </View>
      <FlatList
        data={allHighscores}
        renderItem={highscoreData => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 2
            }}
          >
            <Text
              style={{
                width: "33%",
                textAlign: "left",
                fontWeight:
                  highscoreData.item.username === user.displayName
                    ? "bold"
                    : "normal"
              }}
            >
              {highscoreData.item.username}
            </Text>
            <Text
              style={{
                width: "33%",
                textAlign: "center",
                fontWeight:
                  highscoreData.item.username === user.displayName
                    ? "bold"
                    : "normal"
              }}
            >
              {highscoreData.item.highscore}
            </Text>
            <Text
              style={{
                width: "33%",
                textAlign: "right",
                fontWeight:
                  highscoreData.item.username === user.displayName
                    ? "bold"
                    : "normal"
              }}
            >
              {highscoreData.item.date}
            </Text>
          </View>
        )}
      />
    </DefaultBackground>
  );
};

HighscoresScreen.navigationOptions = {
  headerTitle: "High Scores",
  headerShown: true
};

export default HighscoresScreen;
