import React from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Icon } from "react-native-elements";
import ExerciseScreen from './exerciseScreen';
import WorkoutScreen from './workoutScreen';
import ScaleScreen from './scaleScreen';

/**
 * Creating an app container with 3 tabs on the bottom of the screen once user agrees to the waiver
 * 
 * @author Bobby Nguyen
 * @since 1.0.0
 */
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
