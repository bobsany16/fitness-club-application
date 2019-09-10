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
          tabBarIcon: () => <Icon name="dumbbell" type="material-community" />
        }
      },

      Scale: {
        screen: ScaleScreen,
        navigationOptions: {
          tabBarIcon: () => <Icon name="scale-bathroom" type="material-community" />
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
