import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, SearchBar } from "react-native-elements";

class WorkoutScreen extends React.Component {
  constructor(props){
    super(props)
    this.state={}
  }
  componentDidMount() {
    
  }
  render() {
    //console.log(this.props.screenProps.workoutNames);
    const workoutNames = this.props.screenProps.workoutNames;
    return (
      <View style={styles.container}>
        <View style={styles.searchSection}>
          <SearchBar
            /*inputStyle={styles.search_bar_input}*/
            containerStyle={styles.search_bar}
            placeholder="Search"
            platform="default"
            /*lightTheme="true"
            round="true"*/
          />
        </View>
        <ScrollView style={styles.workoutSection}>
          <Button
            buttonStyle={styles.workoutModels}
            style={styles.workoutTitles}
            title={workoutNames[0]}
            type="solid"
          ></Button>
          <Button
            buttonStyle={styles.workoutModels}
            style={styles.workoutTitles}
            title={workoutNames[1]}
            type="solid"
          ></Button>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column"
  },

  searchSection: {
    height: "15%",
    justifyContent: "flex-end"
    /*backgroundColor: "#a29bfe"*/
  },

  search_bar: {
    backgroundColor: "white",
    borderBottomColor: "transparent",
    borderTopColor: "transparent"
  },

  /*search_bar_input: {
    backgroundColor: "white",
    borderColor: "white",
    borderRadius: 5
  },*/

  workoutSection: {
    flexDirection: "column",
    height: "85%"
  },

  workoutModels: {
    flexDirection: "column",
    height: 200,
    borderRadius: 45,
    backgroundColor: "#b2bec3",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 10
  },

  workoutTitles: {
    fontFamily: "AppleSDGothicNeo-Light",
    fontSize: 50,
    letterSpacing: 10
  }
});

export default WorkoutScreen;
