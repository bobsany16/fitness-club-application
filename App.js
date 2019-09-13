import React from "react";
import { StyleSheet, Text, View } from "react-native";
import NavBar from "./src/components/tabBottomNav";
import WaiverScreen from "./src/components/waiverScreen";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accepted: false,
      workoutData: [],
      workoutNames: [],
      exerciseData: []
    };
  }

  async componentDidMount() {
    let wData = await this.getWorkoutData();
    let wNames = [...new Set(wData.map(arr => arr[0]))]
    let eData = await this.getExerciseData();
    this.setState({
      workoutData: wData,
      workoutNames: wNames,
      exerciseData: eData
    })
  }

  acceptWaiver = async () => {
    this.setState({
      accepted: true
    });
  };

  getWorkoutData = async () => {
    const res = await fetch('http://9e62a130.ngrok.io/workoutData');
    const workoutData = await res.json();
    return workoutData;
  }

  getExerciseData = async () => {
    const res = await fetch('http://9e62a130.ngrok.io/exerciseData');
    const exerciseData = await res.json();
    return exerciseData;
  }

  render() {
    if (this.state.accepted === true) {
      return <NavBar screenProps={{ workoutData: this.state.workoutData, workoutNames: this.state.workoutNames, exerciseData: this.state.exerciseData }}></NavBar>;
    } else {
      return <WaiverScreen acceptWaiver={this.acceptWaiver}></WaiverScreen>;
    }
  }
}
