import React from "react";

import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/styles";

const IconButton = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}
      style={{ ...styles.shareButton, ...props.style }}
    >
      <Ionicons
        style={{ justifyContent: "center", alignSelf: "center" }}
        name={props.icon}
        size={30}
        color={props.color}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
