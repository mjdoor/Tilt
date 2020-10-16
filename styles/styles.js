import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 80,
    paddingHorizontal: 30,
    height: "100%"
  },
  input: {
    backgroundColor: "white",
    borderColor: "grey",
    borderWidth: 1,
    marginVertical: 10,
    paddingLeft: 5,
    fontSize: 20,
    height: 40
  },
  title: {
    color: "rgb(14, 224, 241)",
    fontSize: 90,
    textAlign: "center"
  },
  roundedButton: {
    height: 50,
    width: 130,
    alignSelf: "center",
    borderRadius: 25,
    marginVertical: 10,
    shadowOpacity: 1,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 4 },
    elevation: 5
  },
  shareButton: {
    height: 44,
    width: 44,
    justifyContent: "center",
    marginHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 22,
    shadowOpacity: 1,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 4 },
    elevation: 2
  },
  defaultInnerContainer: {
    width: "95%",
    alignSelf: "center",
    justifyContent: "center"
  }
});

export default styles;
