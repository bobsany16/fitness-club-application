import React from "react";
import { Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Icon } from "react-native-elements";

class JournalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> Journal View </Text>
      </View>
    );
  }
}

class WorkoutScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> Workout View</Text>
      </View>
    );
  }
}

class ScaleScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> Scale View</Text>
      </View>
    );
  }
}

const Nav = createAppContainer(
  createBottomTabNavigator(
    {
      Journal: {
        screen: JournalScreen,
        navigationOptions: {
          tabBarIcon: () => <Icon name="book" type="antdesign" />
        }
      },

      Workout: {
        screen: WorkoutScreen,
        navigationOptions: {
          tabBarIcon: () => <Icon name="book" type="antdesign" />
        }
      },

      Scale: {
        screen: ScaleScreen,
        navigationOptions: {
          tabBarIcon: () => <Icon name="book" type="antdesign" />
        }
      }
    },

    {
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray'
      }
    }
  )
);

export default Nav;
