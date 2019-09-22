import React from "react";
import { Alert, Dimensions, Animated, Keyboard, UIManager, TextInput, StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-elements'
const { State: TextInputState } = TextInput;

class ScaleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleData: [],
      text: "",
      shift: new Animated.Value(0)
    };
  }

  addToScaleData = (data) => {
    if (data > 1000 || data.charAt(0) == 0) {
      Alert.alert('Weight Not Possible', 'Please enter valid weight',
        { text: 'OK', onPress: () => { } }, { cancelable: true });
    }
    else {
      this.state.scaleData.push(data);
    }
  }

  saveText = (newText) => {
    this.setState({
      text: newText
    })

  }

  removeText = () => {
    this.setState({
      text: ''
    })
  }

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  render() {
    const { shift } = this.state;
    return (
      <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
        <View style={{ paddingTop: '5%' }}>
          <Text style={styles.scaleScreenTitle}>Your Scale</Text>
        </View>
        <View style={styles.enterTodayWeightBox}>
          <Text style={styles.enterWeightText}>Enter Today's Weight</Text>
          <TextInput
            style={styles.textInputBox}
            keyboardType='number-pad'
            returnKeyType='done'
            placeholder='Enter Weight (In Pounds)'
            onFocus={() => this.removeText()}
            onChangeText={text => this.saveText(text)}
            value={this.state.text}
          />
          <Button
            buttonStyle={{ backgroundColor: '#ffd700', borderRadius: 20 }}
            title="Submit"
            titleStyle={{ color: 'black', width: '50%' }}
            onPress={() => {
              this.addToScaleData(this.state.text);
              this.removeText(this.state.text);
            }}
          />
        </View>
      </Animated.View>
    );
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + (fieldHeight * 3));
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          useNativeDriver: true,
        }
      ).start();
    });
  }

  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        useNativeDriver: true,
      }
    ).start();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  scaleScreenTitle: {
    fontSize: 50,
    fontWeight: '700'
  },

  enterWeightText: {
    fontSize: 30,
    fontWeight: '500',
    color: 'white'
  },

  textInputBox: {
    fontSize: 20,
    height: '25%',
    width: '60%',
    borderColor: 'white',
    color: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: 'white',
    borderRadius: 15,

  },
  enterTodayWeightBox: {
    alignItems: 'center',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    height: '40%',
    width: '100%',
    borderRadius: 25,
    backgroundColor: "black",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingBottom: 35,
    paddingTop: 15
  },
});

export default ScaleScreen;