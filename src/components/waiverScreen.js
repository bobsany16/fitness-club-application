import React from "react";
import { ScrollView, StyleSheet, Linking, Text, View } from "react-native";
import { Button } from "react-native-elements";

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
              ST. BONAVENTURE UNIVERSITY WAIVER OF LIABILITY AND HOLD HARMLESS
              AGREEMENT{"\n"} {"\n"} 

              1. In consideration for the opportunity to participate
              in the workouts on this mobile application and other valuable
              consideration, by and through my execution of this document
              (hereinafter "WAIVER") I hereby RELEASE, WAIVE, DISCHARGE AND
              COVENANT NOT TO SUE St. Bonaventure University, its officers,
              servants, agents, and/or employees (hereinafter "RELEASEES"). This
              WAIVER shall be construed as broadly as permissible under the laws
              of the State of New York, and is explicitly intended to preclude
              me from maintaining a civil action against RELEASEES in connection
              with any claims, demands, actions and causes of action whatsoever
              arising out of, or related to, any loss, damage, or injury,
              including death, that may be sustained by me, or to any property
              belonging to me, whether caused by the negligence of the RELEASEES
              or otherwise while participating in such activity, or while in,
              on, or upon any premises where any portion of said activity is
              being conducted, as well as while in transit to and from said
              premises, or at any time at any location between my departure in
              connection with the above referenced activity and the time I
              complete my return from the activity.

              {"\n"}2. I am aware of no physical
              or mental infirmity that could reasonably be construed to effect
              my ability to safely and fully participate in this activity, and I
              have not taken any action or made any representation to the
              RELEASEES regarding said ability which is untrue or upon which
              RELEASEES would be unjustified in relying with regard to my
              health, wellness and general ability to participate.

              {"\n"}3. I am fully
              aware of risks and hazards connected with the activity, including
              but not limited to, the risks as noted herein involving travel,
              and I hereby elect to voluntarily participate in said activity,
              and to enter any involved travel arrangements and premises, and
              engage in the aforementioned activity knowing that the activity or
              necessary components thereto may be hazardous to me and my
              property. I voluntarily assume full responsibility for any risks
              of loss, property damage or personal injury, including death, that
              may be sustained by me, or any loss or damage to property owned by
              me, as a result of being engaged in such an activity, whether
              caused by the negligence of RELEASEES or otherwise. 

              {"\n"}4. I further
              hereby agree to indemnify and hold harmless the RELEASEES from any
              loss, liability, damage or costs, including court costs and
              attorney's fees, that may accrue due to my participation in said
              activity, whether caused by negligence of RELEASEES or otherwise.

              {"\n"}5. It is my express intent that this Release and Hold Harmless
              Agreement shall bind the members of my family, spouse, or power of
              attorney if I am alive, and my heirs, assigns and personal
              representative if I am not alive. I hereby further agree that this
              Waiver of Liability and Hold Harmless Agreement shall be construed
              in accordance with the laws of the State of New York. 

              {"\n"}6. I
              understand and agree that the University shall not be responsible
              for any medical costs associated with any injury I may sustain. 

              {"\n"}7.
              I further agree to become familiar with the rules and regulations
              of the University concerning student conduct and not to violate
              said rules of any directive or instruction made by the person or
              persons in charge of said activity and that I will further assume
              the complete risk of any activity done in violation of any rule or
              directive or instruction. 

              {"\n"}8. I also understand that I should, and
              am urged by the University to, obtain adequate health and accident
              insurance to cover any personal injury to myself which may be
              sustained during the activity or the travel/transportation to,
              from and during said activity.

              {"\n"}9. If any portion of this document
              is held to be void or unenforceable, then the minimum amount of
              the clause that must necessarily be severed from the remainder of
              the document to enable the clause, or the document as a whole, to
              become or remain valid and enforceable shall be severed. Upon the
              completion of said minimum severance, if at all possible, the
              remainder of the clause and document, shall be and remain in full
              force and effect to the greatest extent permissible under the laws
              of the State of New York. IN SIGNING THIS RELEASE, I ACKNOWLEDGE
              AND REPRESENT THAT I have read the foregoing Waiver of Liability
              and Hold Harmless Agreement, understand it and sign it voluntarily
              as my own free act and deed; no oral representations, statements
              or inducements, apart from the foregoing written agreement, have
              been made; I am at least eighteen (18) years of age and fully
              competent; and I execute this Release for full, adequate and
              complete consideration fully intending to be bound by same..{" "}
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
    //fontFamily: "AppleSDGothicNeo-Bold",
    letterSpacing: 5
  },
  mainTitle: {
    fontSize: 45
    //fontFamily: "AppleSDGothicNeo-Light"
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
    //fontFamily: "AppleSDGothicNeo-Light",
    fontSize: 15,
    margin: 20
  },

  waiverTitle: {
    //fontFamily: "AppleSDGothicNeo-Medium",
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
    //fontFamily: "AppleSDGothicNeo-Bold",
    fontSize: 40
  },

  privacyPolicy: {
    paddingTop: "2%",
    color: "#0185EA",
    flex: 1,
    textDecorationLine: "underline"
    //fontFamily: "AppleSDGothicNeo-Light"
  },

  policySection: {
    height: "20%",
    alignItems: "center",
    justifyContent: "center"
  }
});
export default WaiverScreen;
