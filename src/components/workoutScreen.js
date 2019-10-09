import React from "react";
import {
  Dimensions,
  Modal,
  WebView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

class WorkoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workoutNames: [],
      searchWorkoutNames: [],
      exerciseData: [],
      exerciseNames: [],
      setNames: [],
      search: "",
      currentWorkout: "",
      currentExercise: "",
      youtubeURL: "",
      showWorkoutScreen: true,
      showExerciseScreen: false,
      modalVisible: false,
      loading: false
    };
  }

  async componentDidMount() {
    const setNames = await this.getSetNames();
    this.setState({
      loading: true
    })
    const wNames = await this.getWorkoutNames();
    const exData = await this.getExerciseData();
    this.setState({
      showWorkoutScreen: true,
      workoutNames: wNames,
      exerciseData: exData,
      searchWorkoutNames: wNames,
      loading: false
    });
  }

  getWorkoutNames = async () => {
    const res = await fetch('https://176f8305.ngrok.io/workoutNames');
    const workoutNames = await res.json();
    return workoutNames
  }

  getExerciseData = async () => {
    const res = await fetch('https://176f8305.ngrok.io/exerciseData');
    const exerciseData = await res.json();
    return exerciseData;
  }

  getExerciseNamesByWorkout = async (index) => {
    let workoutId = index + 1;
    const res = await fetch(`https://176f8305.ngrok.io/workout/${workoutId}/exercises`);
    let exerciseNames = await res.json();
    return exerciseNames;
  };

  getSetNames = async (index) => {
    let workoutId = index + 1;
    const res = await fetch(`https://176f8305.ngrok.io/workout/${workoutId}/setData`);
    let setNames = await res.json();
    return setNames;
  }



  setModalVisible(visibility) {
    this.setState({ modalVisible: visibility });
  };

  showExerciseScreen = async (workoutId) => {
    this.setState({
      loading: true
    })
    const exerNames = await this.getExerciseNamesByWorkout(workoutId);
    this.setState({
      exerciseNames: exerNames,
      showExerciseScreen: true,
      showWorkoutScreen: false,
      loading: false
    });
  };

  toggleWorkoutSearchView = text => {
    let wNames = [];
    for (let name of this.state.workoutNames) {
      if (name.includes(text)) {
        wNames.push(name);
      }
    }
    this.setState({
      search: text,
      searchWorkoutNames: wNames
    });
  };

  clearWorkoutSearch = () => {
    this.setState({
      search: "",
      searchWorkoutNames: this.state.workoutNames
    });
  };

  createButtons = names => {
    let buttons = [];
    let myColors = ["#000000", "#FFC107"];
    let myTextColors = ["#FFFFFF", "#000000"];
    if (this.state.showWorkoutScreen === true) {
      buttons = names.map((workoutName, index) => (
        <TouchableOpacity
          key={workoutName}
          onPress={() => {
            this.onPressWorkouts(workoutName, index);
          }}
        >
          <View
            style={{
              backgroundColor: myColors[index % myColors.length],
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
              borderRadius: 45,
              marginHorizontal: 20,
              marginVertical: 10
            }}
          >
            <Text
              key={index}
              style={{
                color: myTextColors[index % myTextColors.length],
                fontSize: 15,
                textTransform: "uppercase",
                letterSpacing: 2
              }}
            >
              Day {index + 1}
            </Text>
            <Text
              key={workoutName}
              style={{
                color: myTextColors[index % myTextColors.length],
                fontSize: 35,
                textTransform: "uppercase",
                letterSpacing: 2
              }}
            >
              {workoutName}
            </Text>
          </View>
        </TouchableOpacity>
      ));
    } else if (this.state.showExerciseScreen === true) {
      buttons = names.map((exName, index) => (
        <TouchableOpacity
          key={exName}
          onPress={() => {
            this.onPressExercises(index);
            this.setState({
              currentExercise: exName
            })
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 100,
              backgroundColor: myColors[index % myColors.length],
              marginVertical: 10
            }}
          >
            <Text
              key={exName}
              style={{
                color: myTextColors[index % myTextColors.length],
                fontSize: 25,
                textTransform: "uppercase",
                letterSpacing: 2
              }}
            >
              {exName}
            </Text>
          </View>
        </TouchableOpacity>
      ));
    }
    return buttons;
  };

  onPressWorkouts = (workoutName, workoutId) => {
    this.setState({
      currentWorkout: workoutName
    });
    this.showExerciseScreen(workoutId);
  };

  onPressExercises = async (index) => {
    this.setState({
      loading: true
    });
    let exId = index + 1;
    const res = await fetch(`https://176f8305.ngrok.io/exercise/${exId}/youtubeLink`);
    let exObj = await res.json();
    let youtubeLink = exObj.youtubeUrl;
    this.setState({
      youtubeURL: youtubeLink,
      loading: false
    })
    this.setModalVisible(true);
  };

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          color='#000000'
          size="large"
          style={styles.activityIndicator} />
      )
    } else {
      if (this.state.showWorkoutScreen === true) {
        let workoutButtons = this.createButtons(this.state.searchWorkoutNames);
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
        let exerciseButtons = this.createButtons(this.state.exerciseNames);
        return (
          <View style={styles.container}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
            >
              <View style={{ height: Dimensions.get("window").height }}>
                <View style={styles.backToWorkoutScrn}>
                  <Icon
                    name="chevron-left"
                    size={25}
                    color="black"
                    onPress={() => {
                      this.setModalVisible(false);
                    }}
                  />
                  <View style={{ paddingRight: 20 }}>
                    <Text style={styles.currentWorkoutTitle}>
                      {this.state.currentExercise}
                    </Text>
                  </View>
                </View>
                <WebView
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  source={{ uri: this.state.youtubeURL }}
                  mediaPlaybackRequiresUserAction={false}
                />
              </View>
            </Modal>
            <View style={styles.backToWorkoutScrn}>
              <Icon
                name="chevron-left"
                size={25}
                color="black"
                onPress={() => {
                  this.setState({
                    showWorkoutScreen: true,
                    showExerciseScreen: false
                  });
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

  backToWorkoutScrn: {
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: "12%",
    alignItems: "flex-end",
    marginBottom: 10
  },

  currentWorkoutTitle: {
    //fontFamily: "AppleSDGothicNeo-Light",
    fontSize: 20
  },

  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  }
});

export default WorkoutScreen;