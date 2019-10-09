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
      todayDate: '',
      xAxisData: [],
      loading: false
    };
  }

  async componentDidMount() {
    let currentDate = this.getCurrentDate();
    this.setState({
      todayDate: currentDate
    })
    let past7Days = this.getLast7Days()
    this.setState({
      loading: true
    })
    let item = JSON.parse(await AsyncStorage.getItem('user'))
    if (item !== null) {
      let dates = item.map(element => {
        return element.date
      })
      let cData = []
      for (var j = 0; j < past7Days.length; j++) {
        if (dates.includes(past7Days[j])) {
          let dateArray = item.filter(element => {
            return element.date === past7Days[j]
          })
          let dateObj = dateArray[0]
          let weight = dateObj.weight;
          cData.push(Number(weight))
        } else {
          cData.push(null)
        }
        this.setState({
          chartData: cData
        })
      }
    }
    this.setState({
      loading: false
    })
    let xAxisInfo = this.getXAxisForChart();
    this.setState({
      xAxisData: xAxisInfo
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
      let currentDate = this.getCurrentDate();
      this.setState({
        todayDate: currentDate
      })
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
      this.setState({
        loading: true
      })
      item = JSON.parse(await AsyncStorage.getItem('user'))
      let dates = item.map(element => {
        return element.date
      })
      let cData = []
      for (var j = 0; j < past7Days.length; j++) {
        if (dates.includes(past7Days[j])) {
          let dateArray = item.filter(element => {
            return element.date === past7Days[j]
          })
          let dateObj = dateArray[0];
          let weight = dateObj.weight;
          cData.push(Number(weight))
        } else {
          cData.push(null)
        }
        this.setState({
          chartData: cData,
          loading: false
        })
      }
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
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          color='#000000'
          size="large"
          style={styles.activityIndicator} />
      )
    } else {
      const data = this.state.chartData
      const contentInset = { top: 10, bottom: 10, right: 10, left: 10 }
      const xAxisHeight = 10
      const { shift } = this.state;
      const Decorator = ({ x, y, data }) => {
        data = data.map((value, index) => {
          if (value !== null) {
            return (<Circle
              key={index}
              cx={x(index)}
              cy={y(value)}
              r={4}
              stroke={'rgb(134, 65, 244)'}
              fill={'black'}
            />)
          }
        })
        return data;
      }
      let newArray = data.filter(element => { return element !== null })
      let average = (newArray.reduce((p, c) => p + c, 0) / newArray.length).toFixed(1);
      average += ' lbs'
      if (this.state.chartData.length < 1) {
        average = 'No data entered.'
      }
      return (
        <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
          <View style={styles.titleAndChart}>
            <Text style={styles.scaleScreenTitle}>Your Scale</Text>
          </View>
          <Text style={{ fontSize: 17 }}>Average Weight: {average}</Text>
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
                formatLabel={(value, index) => this.state.xAxisData[index]}
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