import React from "react";
import { View, Text, FlatList } from "react-native";

import DefaultBackground from "../components/DefaultBackground";

const InstructionScreen = () => {
  const instructions = [
    "At the beginning of each level, watch the sequence of the bouncing circles around the edge of your phone.",
    "When prompted, attempt to replay the sequence, one circle at a time, by quickly tilting your phone in the direction of the appropriate circle, then back to center. (Imagine your phone is holding water, and you want to quickly pour a tiny amount toward the circle you want to select)",
    "Once your tilt has triggered the circle to bounce, you can continue with the next move in the sequence.",
    "If you sucessfully replay the entire sequence correctly, the next level will start immediately.",
    "The number of moves in each sequence matches the number of the level."
  ].map((line, idx) => {
    return { key: `${idx + 1}`, instruction: line };
  });

  return (
    <DefaultBackground>
      <FlatList
        contentContainerStyle={{ paddingBottom: 90 }}
        data={instructions}
        renderItem={itemData => (
          <View
            key={itemData.item.key}
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "rgb(200,200,200)"
            }}
          >
            <Text style={{ fontWeight: "bold", paddingRight: 10 }}>
              {itemData.item.key}
            </Text>
            <Text style={{ flex: 1 }}>{itemData.item.instruction}</Text>
          </View>
        )}
      />
    </DefaultBackground>
  );
};

InstructionScreen.navigationOptions = {
  headerTitle: "Instructions",
  headerShown: true
};

export default InstructionScreen;
