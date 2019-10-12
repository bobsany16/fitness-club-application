import React, { Component } from 'react';
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
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [],
      activeSections: [],
      currentExercise: '',
      modalVisible: false,
      youtubeUrl: '',
      loading: false
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true
    })
    let bodyPartsAndExercises = await this.getBodyPartsAndExercises();
    let bodyPartsData = bodyPartsAndExercises.map(element => {
      return ({
        title: element.bodyPartName,
        exercises: element.exercises
      })
    })
    this.setState({
      content: bodyPartsData,
      loading: false
    })
    //console.log(this.state.content);
  }

  setModalVisible(visibility) {
    this.setState({ modalVisible: visibility });
  };

  getBodyPartsAndExercises = async () => {
    const res = await fetch('http://a5ce3b6e.ngrok.io/bodyPartsAndExercises');
    const bodyPartsExercises = await res.json();
    return bodyPartsExercises
  }

  onPressExercise = async (exName) => {
    const res = await fetch(`http://a5ce3b6e.ngrok.io/exercise/exerciseName/${exName}/youtubeLink`);
    let youtubeLink = await res.json();
    youtubeLink = youtubeLink.youtubeUrl;
    this.setState({
      youtubeUrl: youtubeLink,
      currentExercise: exName
    })
    this.setModalVisible(true);
  }

  createBodyPartsExercisesComponents = () => {
    let myColors = ["#000000", "#FFC107"];
    let myTextColors = ["#FFFFFF", "#000000"];
    let data = this.state.content;
    let components = data.map((element, index) => {
      let buttons = element.exercises.map((exName, index) => {
        return (<TouchableOpacity
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
              height: Dimensions.get('window').height / 9,
              backgroundColor: myColors[index % myColors.length],
              margin: 5
            }}
          >
            <Text
              key={index}
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
        </TouchableOpacity>)
      })
      return (<View key={index} style={{ backgroundColor: '#F0FFFF', width: Dimensions.get('window').width, paddingBottom: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', paddingLeft: 5 }}>
          <Text
            key={element.title}
            style={{ fontSize: 25, paddingRight: 6 }}>{element.title}</Text>
          <Icon
            key={index}
            name="chevron-right"
            size={25}
            color="black"
            style={{ paddingTop: 5 }}
          />
        </View>
        <ScrollView horizontal={true}>
          {buttons}
        </ScrollView>
      </View>)
    })
    return components;
  }

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
      let bodyPartsAndExercises = this.createBodyPartsExercisesComponents();
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
            <View style={{ display: 'flex', alignItems: 'center', paddingBottom: 10 }}>
              <Text style={{ fontSize: 30 }}>Exercise Screen</Text>
            </View>
            <View>
              {bodyPartsAndExercises}
            </View>
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
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: "column"
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  }
});