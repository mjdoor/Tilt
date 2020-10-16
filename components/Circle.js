import React from "react";
import { View, Animated } from "react-native";

const Circle = props => {
  if (props.animated) {
    return (
      <Animated.View
        style={{
          position: "absolute",
          backgroundColor: props.color,
          width: props.size || 300,
          height: props.size || 300,
          borderRadius: props.size / 2 || 150,
          ...props.details
        }}
      />
    );
  } else {
    return (
      <View
        style={{
          position: "absolute",
          backgroundColor: props.color,
          width: props.size || 300,
          height: props.size || 300,
          borderRadius: props.size / 2 || 150,
          ...props.details
        }}
      />
    );
  }
};

export default Circle;
