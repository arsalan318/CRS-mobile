import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Image,
  TextInput,
  Dimensions
} from "react-native";

import {
  Header,
  Icon,
  SearchBar,
  Button,
  Text,
  Card,
} from "react-native-elements";
import { formatImageString } from '../helper/helper'


export const AgencyDetail = ({ navigation, route }) => {
  const [agencyData, setAgencyData] = React.useState({});
  const { width } = Dimensions.get('screen')
  React.useEffect(() => {
    const { data } = route.params
    setAgencyData(data);
  }, [route.params])

  return (
    <ScrollView contentContainerStyle={{}}>
      <Header
        // backgroundColor={"black"}
        // containerStyle={{ height: "10%" }}
        leftComponent={{
          icon: "menu",
          color: "#fff",
          onPress: () => {
            navigation.toggleDrawer();
          },
        }}
        centerComponent={
          <Text style={{ fontSize: 18, color: "#fff" }}>Profile</Text>
        }
      //        rightComponent={{ icon: "home", color: "#fff" }}
      />

      {agencyData && agencyData.id
        ? (
          <>
            <View>
              <View
                style={
                  {
                    marginLeft:20,
                    marginTop:20
                  }
                 }
              >
                <Image
                  source={{
                    uri:
                      formatImageString(agencyData.avatar),
                  }}
                  style={{
                    width: 100,
                    height: 100,

                    borderRadius: 100,
                    marginLeft: width / 3
                  }}
                />
                <Text h4>{agencyData.middleName}</Text>
                {/* <Text>Karachi, Pakistan</Text> */}
              </View>
            </View>

            <Text style={{ marginLeft: 20,marginRight:10,marginBottom:10 }}>Address: {agencyData.name}</Text>

            <Text style={{ marginLeft: 20,marginRight:10,marginBottom:10 }}>Contact: {agencyData.username}</Text>
            <Card>
              <Card.Title style={{ alignSelf: "flex-start" }}>Description</Card.Title>
              <Card.Divider />
              <Text>
                {agencyData.description}
              </Text>
              <Text style={{ fontWeight: "bold" }}>Specialities</Text>

              <Text style={{ fontWeight: "bold" }}>
                Motivating,asdjasd,asdasdsa, asd asd asd as das d asd{" "}
              </Text>
            </Card>
            <Card>
              <Card.Title style={{ alignSelf: "flex-start" }}>Skills</Card.Title>
              <View style={{ flexDirection: "row",flexWrap:"wrap" }}>
                {agencyData.agencyProfiles[0].agencySkills.map(obj => {
                  return (
                    <Text
                      style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 5,
                        margin: 5,
                        fontWeight: "bold",
                        backgroundColor: "#C0C0C0",
                      }}
                    >
                      {obj.skill.name}
                    </Text>
                  )
                })}


              </View>
            </Card>

            <Button buttonStyle={{ marginTop:20,width:width/2,marginLeft:width/4,marginBottom:30 }} onPress={() => { navigation.navigate('Proposal',{agencyId:agencyData.id}) }} title="Submit a Proposal" />

          </>
        )
        : (<View></View>)
      }
    </ScrollView>
  );
};
