import React from "react";

import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/styles";

const RoundedButton = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={{
        ...styles.roundedButton,
        ...props.style,
        backgroundColor: props.backgroundColor || "rgb(0,200,50)"
      }}
      disabled={props.disabled || false}
    >
      <Text
        style={{
          textAlign: "center",
          height: "100%",
          textAlignVertical: "center",
          fontSize: 15
        }}
      >
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export default RoundedButton;
