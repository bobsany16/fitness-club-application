import React from "react";
import { StyleSheet, Text, View } from "react-native";
import NavBar from "./src/components/tabBottomNav";
import WaiverScreen from "./src/components/waiverScreen";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accepted: false,
      workoutNames: []
    };
  }

  async componentDidMount(){
    let wData = await this.getWorkoutData();
    wData = [...new Set(wData.map(arr => arr[0]))]
    this.setState({
      workoutNames: wData
    })
  }

  acceptWaiver = async () => {
    this.setState({
      accepted: true
    });
  };

  getWorkoutData = async () => {
    const res = await fetch('https://fb65e02b.ngrok.io/workoutData');
    const workoutData = await res.json();
    return workoutData;
  }

  render() {
    if (this.state.accepted === true) {
      //console.log(this.state.workoutNames);
      return <NavBar screenProps={{workoutNames:this.state.workoutNames}}></NavBar>;
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

