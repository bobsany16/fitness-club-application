import React from "react";
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, SearchBar } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';

class WorkoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workoutData: [],
      workoutNames: [],
      exerciseData: [],
      exerciseNames: [],
      search: '',
      onExerciseScreen: false,
      currentWorkout: ''
    };
  }

  async componentDidMount() {
    this.setState({
      workoutData: this.props.screenProps.workoutData,
      workoutNames: this.props.screenProps.workoutNames,
      exerciseData: this.props.screenProps.exerciseData
    })
  }

  toggleWorkoutSearchView = text => {
    let wNames = [];
    for (let name of this.props.screenProps.workoutNames) {
      if (name.includes(text)) {
        wNames.push(name);
      }
    }
    this.setState({
      search: text,
      workoutNames: wNames
    })
  }

  clearWorkoutSearch = () => {
    this.setState({
      search: '',
      workoutNames: this.props.screenProps.workoutNames
    })
  }

  toggleExerciseSearchView = text => {
    const exerNames = this.getExerciseNames(this.state.currentWorkout);
    let exNames = [];
    for (let name of exerNames) {
      if (name.includes(text)) {
        exNames.push(name);
      }
    }
    this.setState({
      search: text,
      exerciseNames: exNames
    })
  }

  clearExerciseSearch = () => {
    const exerNames = this.getExerciseNames(this.state.currentWorkout);
    this.setState({
      search: '',
      exerciseNames: exerNames
    })
  }

  getExerciseNames = (workoutName) => {
    let exerciseIds = this.state.workoutData.map(workout => {
      if (workout[0] === workoutName) {
        return workout[1]
      }
    })
    exerciseIds = [...new Set(exerciseIds.filter(exId => exId !== undefined))]
    let exerNames = this.state.exerciseData.map(exercise => {
      if (exerciseIds.includes(exercise[0])) {
        return exercise[1]
      }
    })
    exerNames = [...new Set(exerNames.filter(exName => exName !== undefined))]
    return exerNames
  }

  showExercises = (name) => {
    const exerNames = this.getExerciseNames(name);
    this.setState({
      exerciseNames: exerNames,
      showExerciseScreen: true
    })
  }

  goBackToWorkoutScreen = () => {
    this.setState({
      showExerciseScreen: false
    })
  }

  render() {
    if (this.state.showExerciseScreen === true) {
      var exerciseButtons = [];
      exerciseButtons = this.state.exerciseNames.map(exName => (
        <TouchableOpacity
          key={exName}
        >
          <View style={styles.exerciseModels}>
            <Text
              key={exName}
              style={{
                fontFamily: "AppleSDGothicNeo-Light",
                fontSize: 18,
                letterSpacing: 8,
                fontWeight: '400'
              }}
            >
              {exName}
            </Text>
          </View>
        </TouchableOpacity>
      ));
      return (
        <View style={styles.container}>
          <View style={styles.searchSection}>
            <SearchBar
              onChangeText={text => this.toggleExerciseSearchView(text)}
              onClear={() => this.clearExerciseSearch()}
              inputStyle={styles.search_bar_input}
              containerStyle={styles.search_bar}
              placeholder="Search..."
              platform="default"
              lightTheme={true}
              round={true}
              value={this.state.search}
              searchIcon={{ size: 24 }}
            />
          </View>
          <ScrollView style={styles.workoutSection}>
            <View style={{ paddingLeft: 20, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Icon
                name="chevron-left"
                size={25}
                color="black"
                onPress={() => { this.goBackToWorkoutScreen() }}
              />
              <View style={{ paddingRight: 20 }}>
                <Text style={{ fontSize: 20 }}>
                  {this.state.currentWorkout}
                </Text>
              </View>
            </View>
            {exerciseButtons}
          </ScrollView>
        </View>
      )
    } else {
      var workoutButtons = [];
      workoutButtons = this.state.workoutNames.map(workoutName => (
        <TouchableOpacity
          key={workoutName}
          onPress={() => {
            this.setState({
              currentWorkout: workoutName
            })
            this.showExercises(workoutName)
          }}
        >
          <View style={styles.workoutModels}>
            <Text
              key={workoutName}
              style={{
                fontFamily: "AppleSDGothicNeo-Light",
                fontSize: 18,
                letterSpacing: 8,
                fontWeight: '400'
              }}
            >
              {workoutName}
            </Text>
          </View>
        </TouchableOpacity>
      ));
      return (
        <View style={styles.container}>
          <View style={styles.searchSection}>
            <SearchBar
              onChangeText={text => this.toggleWorkoutSearchView(text)}
              onClear={() => this.clearWorkoutSearch()}
              inputStyle={styles.search_bar_input}
              containerStyle={styles.search_bar}
              placeholder="Search..."
              platform="default"
              lightTheme={true}
              round={true}
              value={this.state.search}
              searchIcon={{ size: 24 }}
            />
          </View>
          <ScrollView style={styles.workoutSection}>{workoutButtons}</ScrollView>
        </View>
      );
    }
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
    justifyContent: "flex-end",
    marginHorizontal: 15
  },

  search_bar: {
    backgroundColor: "white",
    borderBottomColor: "transparent",
    borderTopColor: "transparent"
  },

  workoutSection: {
    flexDirection: "column",
    height: "85%"
  },

  workoutModels: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderRadius: 45,
    backgroundColor: "#b2bec3",
    marginHorizontal: 20,
    marginVertical: 10
  },

  workoutTitles: {
    fontFamily: "AppleSDGothicNeo-Light",
    fontSize: 50,
    letterSpacing: 10
  },

  exerciseModels: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    //borderRadius: 45,
    backgroundColor: "#b2bec3",
    //marginHorizontal: 20,
    marginVertical: 10
  },
});

export default WorkoutScreen;
