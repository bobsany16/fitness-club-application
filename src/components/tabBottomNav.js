import React from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Icon } from "react-native-elements";
import JournalScreen from './journalScreen';
import WorkoutScreen from './workoutScreen';
import ScaleScreen from './scaleScreen';

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
          tabBarIcon: () => <Icon name="book" type="antdesign"/>
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
