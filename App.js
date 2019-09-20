import React from "react";
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
  }

  render() {
    if (this.state.accepted === true) {
      return <NavBar screenProps={{ workoutData: this.state.workoutData, workoutNames: this.state.workoutNames, exerciseData: this.state.exerciseData }}></NavBar>;
    } else {
      return <WaiverScreen acceptWaiver={this.acceptWaiver}></WaiverScreen>;
    }
  }
}
