// Stylesheet for the entry screens (login/register)
import { StyleSheet } from "react-native";
import { colors } from "./variables";

export const entryStyle = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 50,
    color: colors.primary,
    marginBottom: 30,
  },
  inputText: {
    height: 50,
    color: colors.text,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#101010",
    borderRadius: 15,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    color: "#FF7F50",
    borderWidth: 1,
    borderColor: "#303030",
  },
  touchableText: {
    color: "#555",
    marginTop: 20,
  },
});
