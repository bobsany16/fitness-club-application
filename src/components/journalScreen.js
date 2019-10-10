import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

export default class App extends Component {
  state = {
    content: [],
    activeSections: [],
    collapsed: true,
    multipleSelect: false,
    currentExercise: ''
  };

  async componentDidMount() {
    let bodyPartsAndExercises = await this.getBodyPartsAndExercises();
    let bodyPartsData = bodyPartsAndExercises.map(element => {
      return ({
        title: element.bodyPartName,
        exercises: element.exercises
      })
    })
    this.setState({
      content: bodyPartsData
    })
  }

  getBodyPartsAndExercises = async () => {
    const res = await fetch('https://78b85807.ngrok.io/bodyPartsAndExercises');
    const bodyPartsExercises = await res.json();
    return bodyPartsExercises
  }

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSections = sections => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  createExerciseButtons = names => {
    let buttons = []
    let myColors = ["#000000", "#FFC107"];
    let myTextColors = ["#FFFFFF", "#000000"];
    buttons = names.map((exName, index) => {
      return (
        <TouchableOpacity
          key={exName}
          onPress={() => {
            //this.onPressExercises(index);
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
        </TouchableOpacity>)
    })
    return buttons
  }

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <Text style={styles.headerText}>{section.title}</Text>
      </Animatable.View>
    );
  };

  renderContent(section, _, isActive) {
    // let exerciseButtons = this.createExerciseButtons(['hi', 'bye']);
    //console.log(section.exercises)
    let names = section.exercises
    let exerciseButtons = []
    let myColors = ["#000000", "#FFC107"];
    let myTextColors = ["#FFFFFF", "#000000"];
    exerciseButtons = names.map((exName, index) => {
      return (
        <Button
          title={exName}
          key={exName}
          onPress={() => {
            console.log('You have clicked ' + exName)
          }}
        />)
    })
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        <ScrollView horizontal={true}>
          {exerciseButtons}
        </ScrollView>
      </Animatable.View>
    );
  }

  render() {
    const { multipleSelect, activeSections } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
          <Text>Exercise Screen</Text>
          <Accordion
            activeSections={activeSections}
            sections={this.state.content}
            touchableComponent={TouchableOpacity}
            expandMultiple={true}
            renderHeader={this.renderHeader}
            renderContent={this.renderContent}
            duration={400}
            onChange={this.setSections}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
});