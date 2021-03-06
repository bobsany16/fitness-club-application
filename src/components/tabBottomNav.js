import React from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Icon } from "react-native-elements";
import ExerciseScreen from './exerciseScreen';
import WorkoutScreen from './workoutScreen';
import ScaleScreen from './scaleScreen';

const Nav = createAppContainer(
  createBottomTabNavigator(
    {
      Exercises: {
        screen: ExerciseScreen,
        navigationOptions: {
          tabBarIcon: () => <Icon name="search1" type="antdesign" />
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
        activeTintColor: '#FFC107',
        inactiveTintColor: 'black'
      }
    }
  )
);

export default Nav;
