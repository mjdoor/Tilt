import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  Animated,
  Alert
} from "react-native";
import { useSelector } from "react-redux";
import { useKeepAwake } from "expo-keep-awake";

import * as Haptics from "expo-haptics";
import { Gyroscope } from "expo-sensors";
import dateFormat from "dateformat";

import styles from "../styles/styles";
import { firestore } from "../firebaseconfig";
import Circle from "../components/Circle";
import TiltEngine from "../utilities/TiltEngine";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);
const circleSize = screenWidth;
const circleOffsetInit = -circleSize / 2 - 50;

let isMounted = false;

let gyroListener = null;

const GameplayScreen = props => {
  const { user, highscore } = useSelector(state => state);
  const [leftPos] = useState(new Animated.Value(circleOffsetInit));
  const [rightPos] = useState(new Animated.Value(circleOffsetInit));
  const [topPos] = useState(new Animated.Value(circleOffsetInit));
  const [bottomPos] = useState(new Animated.Value(circleOffsetInit));
  const [instructionOpacity] = useState(new Animated.Value(1));
  const [instruction, setInstruction] = useState("WATCH CLOSELY");
  const [viewLevelData, setViewLevelData] = useState(false);
  const [attemptState, setAttemptState] = useState(0);
  const [level, setLevel] = useState(1);

  const animationPropMap = {
    0: topPos,
    1: rightPos,
    2: bottomPos,
    3: leftPos
  };

  const game = new TiltEngine(highscore);
  game.onAnimationNeeded(moveIdx => {
    Animated.sequence(
      createBounceAnimation(animationPropMap[moveIdx])
    ).start(() => game.resetMoveData());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  });
  game.onMoveMade(currentAttemptIndex => {
    setViewLevelData(true);
    setAttemptState(currentAttemptIndex);
  });
  game.onLevelBeat(() => {
    setViewLevelData(false);
    unsubscribeGyroListener();
    setInstruction("YOU GOT IT!");
  });
  game.onNewLevelStart((levelNumber, levelSequence) => {
    setLevel(levelNumber);
    setInstruction("WATCH CLOSELY");
    Animated.timing(instructionOpacity, {
      toValue: 0,
      delay: 1000,
      duration: 500
    }).start(() => setInstruction("START"));

    let animationSequence = [Animated.delay(1500)]; // Delay the start of the preview by 1.5 seconds

    levelSequence.forEach(index =>
      animationSequence.push(
        ...createBounceAnimation(animationPropMap[index], 400)
      )
    );

    // Add animation to fade in the start instruction
    animationSequence.push(
      Animated.timing(instructionOpacity, { toValue: 1, duration: 500 })
    );

    Animated.sequence(animationSequence).start(() => {
      // Ran into issue where if user left the game screen during the preview, the gyroscope listener would be active outside the game screen
      // Using this isMounted variable to ensure user is still on the screen before setting up the gyroscope stuff
      if (isMounted) {
        setupGyroscope();
      }
    });
  });
  game.onGameOver(() => {
    setViewLevelData(false);
    unsubscribeGyroListener();
    setInstruction("WHOOPS!");
    setTimeout(lostGameHandler, 1000);
  });
  game.onNewHighScoreAchieved(newHighScore => {
    setViewLevelData(false);
    unsubscribeGyroListener();
    setInstruction("WHOOPS!");
    setTimeout(newHighscoreHandler, 1000, newHighScore);
  });

  useKeepAwake();

  useEffect(() => {
    Gyroscope.isAvailableAsync().then(isAvailable => {
      if (isAvailable) {
        isMounted = true;
        game.startNewGame();
      } else {
        Alert.alert(
          "Sorry",
          "Gyroscope is not enabled on your device. You won't be able to play this game without the gyroscope.",
          [{ text: "Darn, ok", onPress: () => props.navigation.goBack() }]
        );
      }
    });

    return () => {
      unsubscribeGyroListener();
      isMounted = false;
    };
  }, []);

  const createBounceAnimation = (
    animationProp,
    duration = 100,
    originalValue = circleOffsetInit,
    offsetAmount = -100
  ) => {
    return [
      Animated.timing(animationProp, {
        toValue: originalValue + offsetAmount,
        duration: duration / 1.5
      }),
      Animated.timing(animationProp, {
        toValue: originalValue,
        duration: duration
      })
    ];
  };

  const setupGyroscope = () => {
    const updateInterval = 30;
    game.resetMoveData();
    Gyroscope.setUpdateInterval(updateInterval);
    gyroListener = Gyroscope.addListener(gyroscopeData => {
      game.processMotion(gyroscopeData.x, gyroscopeData.y);
    });
  };

  const unsubscribeGyroListener = () => {
    if (gyroListener) {
      gyroListener.remove();
      gyroListener = null;
    }
  };

  const newHighscoreHandler = score => {
    firestore
      .collection("highscores")
      .doc(user.uid)
      .set(
        { highscore: score, date: dateFormat(Date.now(), "mmmm d, yyyy") },
        { merge: true }
      );

    Alert.alert(
      "New High Score!",
      `Your new high score is ${score}`,
      alertActions
    );
  };

  const lostGameHandler = () => {
    Alert.alert("Game Over", `What would you like to do?`, alertActions);
  };

  const alertActions = [
    { text: "Quit", onPress: () => props.navigation.goBack() },
    { text: "Play Again", onPress: () => game.startNewGame() }
  ];

  return (
    <View style={styles.screen}>
      <StatusBar hidden={true} />
      <Circle
        id="redCircle"
        animated
        size={circleSize}
        color="rgb(255, 102, 102)"
        details={{ bottom: bottomPos }}
      />
      <Circle
        id="purpleCircle"
        animated
        size={circleSize}
        color="rgb(247, 140, 244)"
        details={{ top: topPos }}
      />
      <Circle
        id="yellowCircle"
        animated
        size={circleSize}
        color="yellow"
        details={{
          left: leftPos,
          top: screenHeight / 2 - circleSize / 2
        }}
      />
      <Circle
        id="blueCircle"
        animated
        size={circleSize}
        color="rgb(14, 224, 241)"
        details={{
          right: rightPos,
          top: screenHeight / 2 - circleSize / 2
        }}
      />
      <Animated.View
        style={{
          opacity: instructionOpacity,
          width: "100%",
          height: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            transform: [{ rotate: "90deg" }]
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
              color: level > highscore ? "green" : "black"
            }}
          >
            Level {level}
          </Text>
          {viewLevelData ? (
            <Text>Moves Remaining: {level - attemptState}</Text>
          ) : (
            <Text
              style={{
                textAlign: "center"
              }}
            >
              {instruction}
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default GameplayScreen;
