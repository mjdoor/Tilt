import React, { useState } from "react";

import { View, Animated } from "react-native";

import Circle from "./Circle";
import styles from "../styles/styles";

const DefaultBackground = props => {
  const [rotation] = useState(new Animated.Value(0));
  Animated.loop(
    Animated.sequence([
      Animated.timing(rotation, { toValue: 10, duration: 1000 }),
      Animated.timing(rotation, { toValue: -10, duration: 2000 }),
      Animated.timing(rotation, { toValue: 0, duration: 1000 })
    ]),
    { isInteraction: false }
  ).start();

  return (
    <View style={styles.screen}>
      <Circle color="yellow" details={{ top: -150, left: -150 }} />
      <Circle
        color="rgb(255, 102, 102)"
        details={{
          bottom: -120,
          left: -150
        }}
      />
      <Circle
        color="rgb(247, 140, 244)"
        details={{
          bottom: 50,
          right: -230
        }}
      />
      <Animated.Text
        style={{
          ...styles.title,
          transform: [
            {
              rotate: rotation.interpolate({
                inputRange: [-10, 10],
                outputRange: ["-10deg", "10deg"]
              })
            }
          ]
        }}
      >
        TILT
      </Animated.Text>
      {props.absoluteComponent}
      <View style={styles.defaultInnerContainer}>{props.children}</View>
    </View>
  );
};

export default DefaultBackground;
