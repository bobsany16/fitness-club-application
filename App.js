import React from "react";
import { StyleSheet, Text, View } from "react-native";
import NavBar from "./src/components/tabBottomNav";
import WaiverScreen from "./src/components/waiverScreen";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accepted: false
    };
  }
  acceptWaiver = async () => {
    this.setState({
      accepted: true
    });
  };
  render() {
    if (this.state.accepted === true) {
      return <NavBar></NavBar>;
    } else {
      return <WaiverScreen acceptWaiver={this.acceptWaiver}></WaiverScreen>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
