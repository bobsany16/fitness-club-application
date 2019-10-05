import React from "react";
import { ActivityIndicator, AsyncStorage, Alert, Dimensions, Animated, Keyboard, UIManager, TextInput, StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-elements'
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import { Circle } from 'react-native-svg'

const { State: TextInputState } = TextInput;

class ScaleScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      text: "",
      shift: new Animated.Value(0),
      loading: false,
      todayDate: '',
      yAxisData: []
    };
  }

  async componentDidMount() {
    let currentDate = this.getCurrentDate();
    this.setState({
      todayDate: currentDate
    })
    let past7Days = this.getLast7Days()
    let item = JSON.parse(await AsyncStorage.getItem('user'))
    if (item !== null) {
      let cData = []
      for (var i = 0; i < item.length; i++) {
        for (var j = 0; j < past7Days.length; j++) {
          if (past7Days[j] === item[i].date) {
            cData.push(Number(item[i].weight))
          } else {
            cData.push(null)
          }
        }
      }
      this.setState({
        chartData: cData
      })
    }
    let yAxisInfo = await this.getXAxisForChart();
    this.setState({
      yAxisData: yAxisInfo
    })
  }

  getXAxisForChart() {
    let past7Days = []
    for (var i = 0; i < 7; i++) {
      let dateObject = new Date();
      dateObject.setDate(dateObject.getDate() - i);
      let currentMonth = dateObject.getMonth() + 1;
      let day = dateObject.getDate();
      let year = dateObject.getFullYear();
      let currentDate = `${currentMonth}/${day}/${year}`
      past7Days.push(currentDate)
    }
    past7Days = past7Days.map(str => {
      return str.substring(0, str.indexOf('/', 3))
    }).reverse()
    return past7Days;
  }

  getLast7Days() {
    var last7Days = [];
    for (var i = 0; i < 7; i++) {
      var date = new Date();
      date.setDate(date.getDate() - i);
      let dateString = date.toString();
      last7Days.push(dateString.substring(4, 15));
    }
    return (last7Days.reverse());
  }

  getCurrentDate = () => {
    let dateObject = new Date();
    let currentDate = dateObject.toString().substring(4, 15);
    return currentDate;
  }

  addToScaleData = async (data) => {
    if (data > 1000 || data.charAt(0) == 0 || data.charAt(0) == '') {
      Alert.alert('Weight Not Possible', 'Please enter valid weight',
        { text: 'OK', onPress: () => { } }, { cancelable: true });
    } else {
      let item = JSON.parse(await AsyncStorage.getItem('user'))
      if (item === null) {
        let newArray = [];
        newArray.push({
          date: this.state.todayDate,
          weight: data
        })
        await AsyncStorage.setItem('user', JSON.stringify(newArray))
      } else if (item.length < 7) {
        itemDate = item.filter(eachItem => {
          return eachItem.date === this.state.todayDate
        })
        if (itemDate.length < 1 || itemDate === undefined) {
          item.push({
            date: this.state.todayDate,
            weight: data
          })
          await AsyncStorage.setItem('user', JSON.stringify(item))
        } else {
          Alert.alert('Not Possible', `You have entered a date today already.`,
            { text: 'OK', onPress: () => { } }, { cancelable: true });
        }
      } else {
        itemDate = item.filter(eachItem => {
          return eachItem.date === this.state.todayDate
        })
        if (itemDate.length < 1 || itemDate === undefined) {
          item.shift();
          item.push({
            date: this.state.todayDate,
            weight: data
          });
          await AsyncStorage.setItem('user', JSON.stringify(item))
        } else {
          Alert.alert('Not Possible', `You have entered a date today already.`,
            { text: 'OK', onPress: () => { } }, { cancelable: true });
        }
      }
      let past7Days = this.getLast7Days()
      item = JSON.parse(await AsyncStorage.getItem('user'))
      let cData = []
      for (var i = 0; i < item.length; i++) {
        for (var j = 0; j < past7Days.length; j++) {
          if (past7Days[j] === item[i].date) {
            cData.push(Number(item[i].weight))
          } else {
            cData.push(null)
          }
        }
      }
      this.setState({
        chartData: cData,
        loading: false
      })
    }
    console.log(this.state.chartData);
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

  render() {
    const data = this.state.chartData
    const contentInset = { top: 10, bottom: 10, right: 10, left: 10 }
    const xAxisHeight = 10
    const { shift } = this.state;
    const Decorator = ({ x, y, data }) => {
      for (var index = 0; index < data.length; index++) {
        let value = data[index];
        if (value !== null) {
          return (
            <Circle
              key={index}
              cx={x(index)}
              cy={y(value)}
              r={4}
              stroke={'rgb(134, 65, 244)'}
              fill={'black'}
            />
          )
        }
      }
    }
    return (
      <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
        <View style={styles.titleAndChart}>
          <Text style={styles.scaleScreenTitle}>Your Scale</Text>
        </View>
        <View style={{ height: Dimensions.get('window').height / 2.7, padding: 20, flexDirection: 'row' }}>
          <YAxis
            data={data}
            style={{ marginBottom: xAxisHeight }}
            contentInset={contentInset}
            svg={{ fontSize: 10, fill: 'grey' }}
            formatLabel={(value) => `${value}lbs`}
          />
          <View style={{ flex: 1 }}>
            <LineChart
              style={{ flex: 1 }}
              data={data}
              contentInset={contentInset}
              svg={{ stroke: 'rgb(0, 0, 0)' }}
            >
              <Grid />
              <Decorator />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, height: xAxisHeight }}
              data={data}
              formatLabel={(value, index) => this.state.yAxisData[index]}
              contentInset={{ left: 20, right: 20 }}
              svg={{ fontSize: 10, fill: 'black' }}
            />
          </View>
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
    )
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

export default ScaleScreen