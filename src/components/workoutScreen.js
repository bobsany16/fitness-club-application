import React from "react";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import cuid from "cuid";
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
/**
 * Generates the main workout screen.
 * Displays workout buttons. When pressed -> displays set buttons -> when
 * presssed will display exercise modals -> when pressed will display YouTube video in a modal.
 *
 * @author Bobby Nguyen, Shikhar Dixit
 * @since 1.0.0
 * @extends React.Component
 */
class WorkoutScreen extends React.Component {
  /**
   * Constructor for the class.
   * @param {} props to pass props to parent constructor React.Component
   */
  constructor(props) {
    super(props);
    this.state = {
      workoutNames: [],
      searchWorkoutNames: [],
      setNames: [],
      search: "",
      currentWorkout: "",
      currentExercise: "",
      youtubeURL: "",
      showWorkoutScreen: true,
      showExerciseScreen: false,
      modalVisible: false,
      loading: false,
      setData: {},
      myColorsALT: [],
      myTextColorsALT: []
    };
  }

  /**
   * async function to test if data is fetched from REST API.
   *
   * @returns {Promise} wNames to see if data was fetched from workoutNames.
   */
  async componentDidMount() {
    this.setState({
      loading: true
    });
    const wNames = await this.getWorkoutNames();
    this.setState({
      showWorkoutScreen: true,
      workoutNames: wNames,
      searchWorkoutNames: wNames,
      loading: false
    });
  }

  /**
   * Get the WorkoutNames from API call
   *
   * @returns {string Array} workoutNames string array for workoutNames fetched from API
   */
  getWorkoutNames = async () => {
    const res = await fetch("https://845d4122.ngrok.io/workoutNames");
    const workoutNames = await res.json();
    return workoutNames;
  };

  /**
   * To get the set data for each workout from API call
   *
   * @param {number} index index number for setData from workoutId#
   * @returns {string Array} string array for setNames fetched from API
   */
  getSetDataPerWorkout = async index => {
    let workoutId = index + 1;
    const res = await fetch(
      `https://845d4122.ngrok.io/workout/${workoutId}/setData`
    );
    let setNames = await res.json();
    return setNames;
  };

  /**
   * Sets visibility for youtube modal when clicking on exercise box
   *
   * @param {*} visibility
   */
  setModalVisible(visibility) {
    this.setState({ modalVisible: visibility });
  }

  /**
   * Transitions between search view and normal workout view
   *
   * @param {string} inputText when user types in search box
   */
  toggleWorkoutSearchView = inputText => {
    let wNames = [];
    for (let searchName of this.state.workoutNames) {
      if (searchName.includes(inputText)) {
        wNames.push(searchName);
      }
    }
    this.setState({
      search: inputText,
      searchWorkoutNames: wNames
    });
  };

  /**
   * Resets the search bar to ""
   */
  clearWorkoutSearch = () => {
    this.setState({
      search: "",
      searchWorkoutNames: this.state.workoutNames
    });
  };

  /**
   * Creates dynamic workout plan buttons when click on 'workout' tab
   * Arrow function that takes in variable 'name'
   *
   * @param {string Array} names array to pass in workout names when called
   * @returns {Array} buttons dynamically created
   */
  createWorkoutButtons = names => {
    let buttons = [];
    let myColors = ["#000000", "#FFC107"]; //store black and yellow colors to alternate colors of the workout buttons
    let myTextColors = ["#FFFFFF", "#000000"]; //store black and yellow colors to alternate colors of the workout button texts

    //uses map() function to mapp workoutName to buttons
    buttons = names.map((workoutName, index) => (
      <TouchableOpacity
        key={workoutName}
        onPress={() => {
          this.onPressWorkouts(workoutName, index);
        }}
      >
        <View
          style={[
            styles.workoutNameTouchableOpacity,
            { backgroundColor: myColors[index % myColors.length], fontSize: 15 }
          ]}
        >
          <Text
            key={index}
            style={[
              styles.workoutNameTouchableOpacityText,
              { color: myTextColors[index % myTextColors.length] }
            ]}
          >
            Day {index + 1}
          </Text>
          <Text
            key={workoutName}
            style={[
              styles.workoutNameTouchableOpacityText,
              { color: myTextColors[index % myTextColors.length], fontSize: 35 }
            ]}
          >
            {workoutName}
          </Text>
        </View>
      </TouchableOpacity>
    ));
    return buttons;
  };

  /**
   * Shows exerciseScreen once user clicks on a workout button -> displays sets and exercises
   *
   * @param {number} workoutId
   * @returns {Promise} to getSetDataPerWorkout
   */
  showExerciseScreen = async workoutId => {
    this.setState({
      loading: true
    });
    const setInfo = await this.getSetDataPerWorkout(workoutId);
    this.setState({
      setData: setInfo,
      showExerciseScreen: true,
      showWorkoutScreen: false,
      loading: false
    });
  };

  /**
   * When user presses on a workout button
   *
   * @param {string} workoutName the name for workout plan button
   * @param {number} workoutId the id that comes with the button
   */
  onPressWorkouts = (workoutName, workoutId) => {
    this.setState({
      currentWorkout: workoutName
    });
    this.showExerciseScreen(workoutId);
  };

  /**
   * When pressed on exercise buttons.
   * Displays YouTube video in a modal.
   *
   * @param {string} exName - name for exercise.
   * @returns {Promise} res - fetch YouTube video from exName
   */
  onPressExercise = async exName => {
    this.setState({
      loading: true
    });
    const res = await fetch(
      `https://845d4122.ngrok.io/exercise/exerciseName/${exName}/youtubeLink`
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

  /**
   * Creates screen containing set data when user presses on a workout button.
   * Displays a collapsable with exercise data in each row.
   *
   * @returns {JSX.Element} Collapsable to display exercise data in each row
   */
  createSetScreen = () => {
    let setNames = Object.keys(this.state.setData);
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: Dimensions.get("window").height / 8,
              backgroundColor: myColors[index % myColors.length],
              width: "80%",
              marginVertical: "3%",
              borderRadius: "10%"
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
            >
              {exName}
            </Text>
            <Text
              key={cuid()}
              style={{
                color: myTextColors[index % myTextColors.length],
                fontSize: 20,
                textTransform: "uppercase",
                letterSpacing: 2
              }}
            >
              {reps}
            </Text>
          </TouchableOpacity>
        );
      });
      return (
        <View style={{ marginBottom: "3%" }} key={cuid()}>
          <Collapse key={cuid()}>
            <CollapseHeader key={cuid()}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: Dimensions.get("window").height / 8,
                  borderRadius: "10%",
                  backgroundColor: "#000000",
                  marginHorizontal: "5%"
                }}
              >
                <Text key={cuid()} style={{ color: "#FFFFFF", fontSize: 30 }}>
                  {setName}
                </Text>
              </View>
            </CollapseHeader>
            <CollapseBody
              key={cuid()}
              style={{
                backgroundColor: "#555555",
                marginHorizontal: "5%",
                borderRadius: "10%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {exercises}
            </CollapseBody>
          </Collapse>
        </View>
      );
    });
    return setScreen;
  };

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          color="#000000"
          size="large"
          style={styles.activityIndicator}
        />
      );
    } else {
      if (this.state.showWorkoutScreen === true) {
        let workoutButtons = this.createWorkoutButtons(
          this.state.searchWorkoutNames //wouldn't it just be workoutNames ?
        );
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
            <ScrollView style={styles.workoutSection}>{setScreen}</ScrollView>
          </View>
        );
      }
    }
  }
}

/**
 * Stylesheet
 */
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
    fontSize: 20
  },

  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80
  },

  workoutNameTouchableOpacity: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderRadius: 45,
    marginHorizontal: 20,
    marginVertical: 10
  },

  workoutNameTouchableOpacityText: {
    textTransform: "uppercase",
    letterSpacing: 2
  }
});

export default WorkoutScreen;
