import { StyleSheet } from "react-native";
import { colors } from "./variables";

export const mainStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background
  },
  entryTitle: {
    fontWeight: "bold",
    fontSize: 50,
    color: colors.primary,
    marginBottom: 30,
  },
});
