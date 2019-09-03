import React from "react";
import { StyleSheet, Text, View } from "react-native";
import NavBar from "./src/components/tabBottomNav";

export default function App() {
  return <NavBar></NavBar>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
