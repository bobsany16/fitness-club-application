import React, { Component } from "react";
import {
  Modal,
  Dimensions,
  WebView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [],
      currentExercise: "",
      modalVisible: false,
      youtubeUrl: "",
      loading: false
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true
    });
    let bodyPartsAndExercises = await this.getBodyPartsAndExercises();
    let bodyPartsData = bodyPartsAndExercises.map(element => {
      return {
        title: element.bodyPartName,
        exercises: element.exercises
      };
    });
    this.setState({
      content: bodyPartsData,
      loading: false
    });
  }

  setModalVisible(visibility) {
    this.setState({ modalVisible: visibility });
  }

  getBodyPartsAndExercises = async () => {
    const res = await fetch("https://845d4122.ngrok.io/bodyPartsAndExercises");
    const bodyPartsExercises = await res.json();
    return bodyPartsExercises;
  };

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

  createBodyPartsExercisesComponents = () => {
    let myColors = ["#000000", "#FFC107"];
    let myTextColors = ["#FFFFFF", "#000000"];
    let data = this.state.content;
    let components = data.map((element, index) => {
      let buttons = element.exercises.map((exName, index) => {
        return (
          <TouchableOpacity
            key={exName}
            onPress={() => {
              this.onPressExercise(exName);
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: Dimensions.get("window").height / 9,
                backgroundColor: myColors[index % myColors.length],
                borderRadius: 15,
                marginHorizontal: 8,
                marginVertical: 20
              }}
            >
              <Text
                key={index}
                style={{
                  color: myTextColors[index % myTextColors.length],
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  padding: 5
                }}
              >
                {exName}
              </Text>
            </View>
          </TouchableOpacity>
        );
      });
      return (
        <View
          key={index}
          style={{
            backgroundColor: "#ecf0f1", /* The litter space for the boxes*/
            width: Dimensions.get("window").width,
            marginBottom: 5
          }}
        >
          <View
            style={{ display: "flex", flexDirection: "row", paddingLeft: 8, paddingTop: 5 }}
          >
            <Text
              key={element.title}
              style={{ paddingRight: 5, fontSize: 20, fontWeight: "500" }}
            >
              {element.title}
            </Text>
            <Icon
              key={index}
              name="chevron-right"
              size={17}
              color="#000000"
              style={{ paddingTop: 5 }}
            />
          </View>
          <ScrollView horizontal={true}>{buttons}</ScrollView>
        </View>
      );
    });
    return components;
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
      let bodyPartsAndExercises = this.createBodyPartsExercisesComponents();
      return (
        <View style={styles.container}>
          <View style={{ paddingTop: '10%' }}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                paddingBottom: "5%"
              }}
            >
              <Text style={{ fontSize: 50, fontWeight: "600" }}>
                All Exercises
                </Text>
            </View>
            <ScrollView>
              <View>{bodyPartsAndExercises}</View>
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
              >
                <View style={{ height: Dimensions.get("window").height }}>
                  <View style={styles.backToExerciseScreen}>
                    <Icon
                      name="chevron-left"
                      size={25}
                      color="#000000"
                      onPress={() => {
                        this.setModalVisible(false);
                      }}
                    />
                    <View style={{ paddingRight: 20 }}>
                      <Text style={styles.currentExerciseTitle}>
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
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  backToExerciseScreen: {
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: "12%",
    alignItems: "flex-end",
    marginBottom: 10
  },
  currentExerciseTitle: {
    fontSize: 20
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80
  }
});
