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
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import cuid from 'cuid'

class WorkoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workoutNames: [],
      searchWorkoutNames: [],
      exerciseNames: [],
      setNames: [],
      search: "",
      currentWorkout: "",
      currentExercise: "",
      youtubeURL: "",
      showWorkoutScreen: true,
      showExerciseScreen: false,
      modalVisible: false,
      loading: false,
      setData: {}
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true
    })
    const wNames = await this.getWorkoutNames();
    this.setState({
      showWorkoutScreen: true,
      workoutNames: wNames,
      searchWorkoutNames: wNames,
      loading: false
    });
  }

  getWorkoutNames = async () => {
    const res = await fetch('http://659fc8a7.ngrok.io/workoutNames');
    const workoutNames = await res.json();
    return workoutNames
  }

  getSetDataPerWorkout = async (index) => {
    let workoutId = index + 1;
    const res = await fetch(`http://659fc8a7.ngrok.io/workout/${workoutId}/setData`);
    let setNames = await res.json();
    return setNames;
  }

  setModalVisible(visibility) {
    this.setState({ modalVisible: visibility });
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

  createWorkoutButtons = names => {
    let buttons = [];
    let myColors = ["#000000", "#FFC107"];
    let myTextColors = ["#FFFFFF", "#000000"];
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
    return buttons;
  };

  showExerciseScreen = async (workoutId) => {
    this.setState({
      loading: true
    })
    const setInfo = await this.getSetDataPerWorkout(workoutId);
    this.setState({
      setData: setInfo,
      showExerciseScreen: true,
      showWorkoutScreen: false,
      loading: false
    });
  };

  onPressWorkouts = (workoutName, workoutId) => {
    this.setState({
      currentWorkout: workoutName
    });
    this.showExerciseScreen(workoutId);
  };

  onPressExercise = async exName => {
    this.setState({
      loading: true
    });
    const res = await fetch(
      `http://659fc8a7.ngrok.io/exercise/exerciseName/${exName}/youtubeLink`
    );
    let youtubeLink = await res.json();
    youtubeLink = youtubeLink.youtubeUrl;
    this.setState({
      youtubeUrl: youtubeLink,
      currentExercise: exName,
      loading: false
    });
    this.setModalVisible(true);
  };

  createSetScreen = () => {
    let setNames = Object.keys(this.state.setData)
    let myColors = ["#FFC107", "white"];
    let myTextColors = ["#000000", "black"];
    let setScreen = setNames.map((setName, index) => {
      let exData = this.state.setData[setName];
      let exercises = exData.map((element, index) => {
        let exName = element.exerciseName;
        let reps = element.rep;
        return (
          <TouchableOpacity
            onPress={() => {
              this.onPressExercise(exName);
            }}
            key={cuid()}
            style={{
              display: 'flex',
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: Dimensions.get('window').height / 8,
              backgroundColor: myColors[index % myColors.length],
              width: '80%',
              marginVertical: '3%',
              borderRadius:'10%'
            }}
          >
            <Text
              key={cuid()}
              style={{
                color: myTextColors[index % myTextColors.length],
                fontSize: 20,
                textTransform: "uppercase",
                letterSpacing: 2
              }}
            >{exName}</Text>
            <Text
              key={cuid()}
              style={{
                color: myTextColors[index % myTextColors.length],
                fontSize: 20,
                textTransform: "uppercase",
                letterSpacing: 2
              }}
            >{reps}</Text>
          </TouchableOpacity>
        )
      })
      return (
        <View style={{ marginBottom: '3%' }}
          key={cuid()} >
          <Collapse
            key={cuid()}
          >
            <CollapseHeader
              key={cuid()}
            >
              <View style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: Dimensions.get('window').height / 8,
                borderRadius: '10%',
                backgroundColor: '#000000',
                marginHorizontal: '5%'
              }}
              >
                <Text
                  key={cuid()}
                  style={{ color: '#FFFFFF', fontSize: 30 }}
                >
                  {setName}
                </Text>
              </View>
            </CollapseHeader>
            <CollapseBody
              key={cuid()}
              style={{
                backgroundColor: '#555555',
                marginHorizontal: '5%',
                borderRadius: '10%',
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
              {exercises}
            </CollapseBody>
          </Collapse>
        </View >)
    })
    return setScreen
  }

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          color="#000000"
          size="large"
          style={styles.activityIndicator}
        />
      )
    } else {
      if (this.state.showWorkoutScreen === true) {
        let workoutButtons = this.createWorkoutButtons(this.state.searchWorkoutNames);
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
        let setScreen = this.createSetScreen();
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
                  source={{ uri: this.state.youtubeUrl }}
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
              {setScreen}
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