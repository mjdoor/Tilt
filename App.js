import React from "react";

import { Provider } from "react-redux";
import { configureStore } from "./redux/store";
import AppNavigator from "./navigation/AppNavigator";

// Needed to add this for some weird firebase error
import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

console.disableYellowBox = true;

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
