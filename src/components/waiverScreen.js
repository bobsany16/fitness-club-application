import React from "react";
import { Linking, Text, View } from "react-native";
import { Button } from "react-native-elements";

class WaiverScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 500
        }}
      >
        <Button
          raised={true}
          title="I Accept"
          type="solid"
          onPress={() => {
            this.props.acceptWaiver()
          }}
        />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{ color: "#0185EA", textDecorationLine: "underline" }}
            onPress={() =>
              Linking.openURL(
                "https://docs.google.com/document/d/1j8rH0IlnFkCElLeaIaYba1zVD0uiuUNDBG_ueOFJZJw/edit?ts=5d6434b1"
              )
            }
          >
            Privacy Policy
          </Text>
        </View>
      </View>
    );
  }
}
export default WaiverScreen;
