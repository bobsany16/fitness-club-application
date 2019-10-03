import React from "react";
import { ActivityIndicator, AsyncStorage, Alert, Dimensions, Animated, Keyboard, UIManager, TextInput, StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-elements'
import { LineChart } from 'react-native-chart-kit';

const { State: TextInputState } = TextInput;

class ScaleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleData: [],
      chartData: [],
      text: "",
      shift: new Animated.Value(0),
      loading: false
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true
    })
    let item = JSON.parse(await AsyncStorage.getItem('user'))
    if (item !== null) {
      this.setState({
        chartData: item.map(str => {
          return Number(str)
        })
      })
    }
    this.setState({
      loading: false
    })
  }

  addToScaleData = async (data) => {
    if (data > 1000 || data.charAt(0) == 0 || data.charAt(0) == '') {
      Alert.alert('Weight Not Possible', 'Please enter valid weight',
        { text: 'OK', onPress: () => { } }, { cancelable: true });
    }
    else {
      this.setState({
        loading: true
      })
      this.state.scaleData.push(data);
      let item = JSON.parse(await AsyncStorage.getItem('user'))
      if (item === null) {
        await AsyncStorage.setItem('user', JSON.stringify(this.state.scaleData))
      } else {
        item.push(data);
        await AsyncStorage.setItem('user', JSON.stringify(item))
      }
      item = JSON.parse(await AsyncStorage.getItem('user'))
      this.setState({
        chartData: item.map(str => {
          return Number(str)
        }),
        loading: false
      })
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
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          color='#000000'
          size="large"
          style={styles.activityIndicator} />
      )
    } else {
      return (
        <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
          <View style={styles.titleAndChart}>
            <Text style={styles.scaleScreenTitle}>Your Scale</Text>
            <LineChart
              data={{
                datasets: [
                  {
                    data: this.state.chartData,
                    strokeWidth: 3
                  }
                ]
              }}
              width={Dimensions.get("window").width}
              height={Dimensions.get('window').height / 2.7}
              chartConfig={{
                backgroundGradientFrom: '#1E2923',
                backgroundGradientTo: '#08130D',
                decimalPlaces: 1,
                color: () => '#00FFFF',
                style: {
                  borderRadius: 16
                }
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
          <View style={styles.enterTodayWeightBox}>
            <Text style={styles.enterWeightText}>Enter Today's Weight</Text>
            <TextInput
              style={styles.textInputBox}
              keyboardType='number-pad'
              returnKeyType='done'
              placeholder='Enter Weight (In Pounds)'
              onFocus={() => this.removeText(this.state.text)}
              onChangeText={text => this.saveText(text)}
              value={this.state.text}
            />
            <Button
              buttonStyle={{ backgroundColor: '#ffd700', borderRadius: 20 }}
              title="Submit"
              titleStyle={{ color: 'black', width: '50%' }}
              onPress={async () => {
                await this.addToScaleData(this.state.text);
                this.removeText(this.state.text);
              }}
            />
          </View>
        </Animated.View>
      );
    }
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
          toValue: -250,
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
    alignItems: 'center'
  },
  titleAndChart: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    paddingTop: '5%'
  },
  scaleScreenTitle: {
    fontSize: 50,
    fontWeight: '700'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
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