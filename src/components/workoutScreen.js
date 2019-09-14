import React from "react";
import { Dimensions, Modal, WebView, TouchableOpacity, ScrollView, StyleSheet, Text, View } from "react-native";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

class WorkoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workoutData: [],
      workoutNames: [],
      exerciseData: [],
      exerciseNames: [],
      search: "",
      currentWorkout: "",
      currentExercise: "",
      showWorkoutScreen: true,
      showExerciseScreen: false,
      modalVisible: false,
    };
  }

  async componentDidMount() {
    this.setState({
      showWorkoutScreen: true
    })
    this.setState({
      workoutData: this.props.screenProps.workoutData,
      workoutNames: this.props.screenProps.workoutNames,
      exerciseData: this.props.screenProps.exerciseData
    });
  }

  setModalVisible(visibility) {
    this.setState({ modalVisible: visibility });
  }


  getExerciseNames = workoutName => {
    let exerciseIds = this.state.workoutData.map(workout => {
      if (workout[0] === workoutName) {
        return workout[1];
      }
    });
    exerciseIds = [...new Set(exerciseIds.filter(exId => exId !== undefined))];
    let exerNames = this.state.exerciseData.map(exercise => {
      if (exerciseIds.includes(exercise[0])) {
        return exercise[1];
      }
    });
    exerNames = [...new Set(exerNames.filter(exName => exName !== undefined))];
    return exerNames;
  };

  showExerciseScreen = async workoutName => {
    const exerNames = await this.getExerciseNames(workoutName);
    this.setState({
      exerciseNames: exerNames,
      showExerciseScreen: true,
      showWorkoutScreen: false
    });
  };

  showWorkoutScreen = () => {
    this.setState({
      showWorkoutScreen: true,
      showExerciseScreen: false
    });
  };

  setExerciseName = (exerciseName) => {
    this.setState({
      currentExercise: exerciseName
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
    });
  };

  clearWorkoutSearch = () => {
    this.setState({
      search: "",
      workoutNames: this.props.screenProps.workoutNames
    });
  };

  createButtons = (names) => {
    let buttons = [];
    if (this.state.showWorkoutScreen === true) {
      buttons = names.map(workoutName =>
        <TouchableOpacity
          key={workoutName}
          onPress={() => {
            this.onPressWorkouts(workoutName);
          }}

        >
          <View style={styles.workoutModels}>
            <Text key={workoutName} style={styles.workoutTitles}>
              {workoutName}
            </Text>
          </View>
        </TouchableOpacity>)
    } else if (this.state.showExerciseScreen === true) {
      buttons = names.map(exName =>
        <TouchableOpacity
          key={exName}
          onPress={() => {
            this.onPressExercises(exName);
          }}
        >
          <View style={styles.exerciseModels}>
            <Text
              key={exName}
              style={styles.workoutTitles}
            >
              {exName}
            </Text>
          </View>
        </TouchableOpacity>)
    }
    return buttons;
  }

  onPressWorkouts = (workoutName) => {
    this.setState({
      currentWorkout: workoutName
    });
    this.showExerciseScreen(workoutName);
  }

  onPressExercises = (exName) => {
    this.setModalVisible(true);
    this.setExerciseName(exName);
  }

  render() {
    if (this.state.showWorkoutScreen === true) {
      let workoutButtons = this.createButtons(this.state.workoutNames);
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
          <ScrollView style={styles.workoutSection}>
            {workoutButtons}
          </ScrollView>
        </View>
      );
    }

  if (this.state.showExerciseScreen === true) {
    let exerciseButtons = this.createButtons(this.state.exerciseNames)
    let exDataObj = {};
    let youtubeURL = '';
    if (this.state.currentExercise !== '') {
      exDataObj = this.state.exerciseData.filter(exArr => exArr[1] === this.state.currentExercise);
      youtubeURL = exDataObj[0][2];
    }
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          >
          <View style={{ height: Dimensions.get('window').height }}>
            <WebView
              javaScriptEnabled={true}
              domStorageEnabled={true}
              source={{ uri: youtubeURL }}
            />
            <View style={{ paddingTop: 20 }}>
              <Icon
                name="chevron-left"
                size={25}
                color="black"
                onPress={() => {
                  this.setModalVisible(false);
                }}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.backToWorkoutScrn}>
          <Icon
            name="chevron-left"
            size={25}
            color="black"
            onPress={() => {
              this.showWorkoutScreen();
            }}
          />
          <View style={{ paddingRight: 20 }}>
            <Text style={styles.currentWorkoutTitle}>
              {this.state.currentWorkout}
            </Text>
          </View>
        </View>
        <ScrollView style={styles.workoutSection}>
          {exerciseButtons}
        </ScrollView>
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
    fontSize: 25
  },

  exerciseModels: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    backgroundColor: "#b2bec3",
    marginVertical: 10
  },

  backToWorkoutScrn: {
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: "12%",
    alignItems: "flex-end",
    marginBottom: 10
  },

  currentWorkoutTitle: {
    fontFamily: "AppleSDGothicNeo-Light",
    fontSize: 20
  }
});

export default WorkoutScreen;
