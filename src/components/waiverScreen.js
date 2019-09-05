import React from "react";
import { ScrollView, StyleSheet, Linking, Text, View } from "react-native";
import { Button } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";

class WaiverScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainTitleSection}>
          <Text style={styles.mainTitle}> THOMAS'S </Text>
          <Text style={styles.mainTitle2}> FITNESS APP </Text>
        </View>

        <View style={styles.waiver}>
          <Text style={styles.waiverTitle}> Waiver Liability </Text>
          <ScrollView>
            <Text style={styles.waiverScroller}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              vitae est venenatis, cursus mi et, hendrerit eros. Etiam
              imperdiet, arcu id condimentum aliquam, est augue vehicula elit,
              quis consequat tortor ligula eu mi. Suspendisse mauris quam,
              malesuada eget mollis at, ornare id leo. Duis mauris arcu,
              bibendum in maximus a, faucibus sed nibh. Integer at iaculis ex,
              sit amet aliquet neque. Sed interdum nibh a arcu tempus, vel
              ullamcorper tortor finibus. Proin purus felis, ullamcorper
              porttitor dictum et, rutrum vel nibh. Integer aliquet euismod nunc
              nec fermentum. In volutpat consectetur ipsum ultricies rhoncus.
              Phasellus ullamcorper eget dolor vel gravida. Praesent volutpat
              eget risus in fringilla. Maecenas non odio non felis condimentum
              mollis. Vestibulum ante ipsum primis in faucibus orci luctus et
              ultrices posuere cubilia Curae; Duis pretium diam vitae diam
              faucibus consequat. Mauris dignissim ullamcorper ligula, in
              pellentesque nulla aliquam vel. Cras sit amet ligula erat. Proin
              id semper nunc. Vivamus a diam posuere, vehicula ex ut, finibus
              metus. Integer non vestibulum odio. Etiam in sem et tortor sodales
              pharetra. Suspendisse quis enim dui.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              vitae est venenatis, cursus mi et, hendrerit eros. Etiam
              imperdiet, arcu id condimentum aliquam, est augue vehicula elit,
              quis consequat tortor ligula eu mi. Suspendisse mauris quam,
              malesuada eget mollis at, ornare id leo. Duis mauris arcu,
              bibendum in maximus a, faucibus sed nibh. Integer at iaculis ex,
              sit amet aliquet neque. Sed interdum nibh a arcu tempus, vel
              ullamcorper tortor finibus. Proin purus felis, ullamcorper
              porttitor dictum et, rutrum vel nibh. Integer aliquet euismod nunc
              nec fermentum. In volutpat consectetur ipsum ultricies rhoncus.
              Phasellus ullamcorper eget dolor vel gravida. Praesent volutpat
              eget risus in fringilla. Maecenas non odio non felis condimentum
              mollis. Vestibulum ante ipsum primis in faucibus orci luctus et
              ultrices posuere cubilia Curae; Duis pretium diam vitae diam
              faucibus consequat. Mauris dignissim ullamcorper ligula, in
              pellentesque nulla aliquam vel. Cras sit amet ligula erat. Proin
              id semper nunc. Vivamus a diam posuere, vehicula ex ut, finibus
              metus. Integer non vestibulum odio. Etiam in sem et tortor sodales
              pharetra. Suspendisse quis enim dui.{" "}
            </Text>
          </ScrollView>
        </View>

        <View style={styles.acceptSection}>
          <Button
            buttonStyle={styles.acceptButton}
            style={styles.fontButton}
            /*linearGradientProps={{
              colors: ["#2d3436", "#636e72"]
            }}*/
            title="I Accept"
            type="solid"
            onPress={() => {
              this.props.acceptWaiver();
            }}
          />
          <View style={styles.policySection}>
            <Text
              style={styles.privacyPolicy}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center"
  },

  mainTitleSection: {
    height: "10%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginHorizontal: 25,
    marginTop: 80
  },

  mainTitle2: {
    fontSize: 40,
    fontFamily: "AppleSDGothicNeo-Bold",
    letterSpacing: 5
  },
  mainTitle: {
    fontSize: 45,
    fontFamily: "AppleSDGothicNeo-Light"
  },

  waiver: {
    flexDirection: "column",
    alignItems: "flex-start",
    height: "50%",
    borderRadius: 30,
    borderColor: "#2d3436",
    backgroundColor: "#dfe6e9",
    margin: 25
  },

  waiverScroller: {
    fontFamily: "AppleSDGothicNeo-Light",
    fontSize: 15,
    margin: 20
  },

  waiverTitle: {
    fontFamily: "AppleSDGothicNeo-Medium",
    fontSize: 17,
    alignItems: "flex-start",
    letterSpacing: 2,
    margin: 13,
    marginTop: 20

  },

  acceptSection: {
    height: "20%",
    flexDirection: "column",
    marginHorizontal: 25,
    marginBottom: 20
  },

  acceptButton: {
    borderRadius: 25,
    height: 50,
    backgroundColor: "#2d3436"
  },

  fontButton: {
    fontFamily: "AppleSDGothicNeo-Bold",
    fontSize: 40
  },

  privacyPolicy: {
    paddingTop: "2%",
    color: "#0185EA",
    flex: 1,
    textDecorationLine: "underline",
    fontFamily: "AppleSDGothicNeo-Light"
  },

  policySection: {
    height: "20%",
    alignItems: "center",
    justifyContent: "center"
  }
});
export default WaiverScreen;
