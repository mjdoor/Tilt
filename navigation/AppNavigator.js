import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import HighscoresScreen from "../screens/HighscoresScreen";
import GameplayScreen from "../screens/GameplayScreen";
import InstructionScreen from "../screens/InstructionScreen";

const AppNavigator = createStackNavigator(
  {
    Authentication: { screen: AuthScreen },
    Home: { screen: HomeScreen },
    Highscores: { screen: HighscoresScreen },
    Gameplay: { screen: GameplayScreen },
    Instructions: { screen: InstructionScreen }
  },
  {
    defaultNavigationOptions: {
      headerShown: false
    }
  }
);

export default createAppContainer(AppNavigator);
