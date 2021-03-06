import React, { useEffect } from "react";
// import { Header } from "react-native-elements";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, ScrollView } from "react-native";

import { Header, SearchBar } from "react-native-elements";
// import { FlatList } from "react-native-gesture-handler";
import { TimelineCard } from "../Components/TimelineCard";
import { VendorCard } from "./VendorCard";
import axios from 'axios';
import { apiDomain } from '../config'



const users = [
  {
    name: "brynn",
    avatar:
      "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
  },

  // more users here
];
export const ProductMaker = ({ navigation }) => {
  const [search, setSearch] = React.useState("");
  const [vendors, setVendors] = React.useState([]);
  const [vendorsFiltered, setVendorsFiltered] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);


  const onSearch = (text) => {
    setSearch(text)
    if (text.length !== 0) {
      const temp = vendors.filter(obj => {
        console.log("obj", obj);
        return obj.firstName.includes(text) || obj.lastName.includes(text);
      })
      setVendorsFiltered(temp)
    }
    else {
      setVendorsFiltered(vendors);
    }

  }




  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${apiDomain}/Vendor`);
      let res = response.data
      setIsLoading(false)
      setVendors(res);
      setVendorsFiltered(res);
    } catch (error) {
      setIsLoading(false)
      console.log(error.message);
    }

  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View>
      <Header
        leftComponent={{
          icon: "menu",
          color: "#fff",
          onPress: () => {
            navigation.toggleDrawer();
          },
        }}
        centerComponent={
          <Text style={{ fontSize: 18, color: "#fff" }}>ConstructTo</Text>
        }
      //        rightComponent={{ icon: "home", color: "#fff" }}
      />

      <SearchBar
        placeholder="Type Here..."
        lightTheme
        onChangeText={(text) => onSearch(text)}
        autoCorrect={false}
        value={search}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {isLoading
          ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 20 }}>
              <ActivityIndicator size="large" color="#03254c" />
            </View>
          )
          : (
            <View>
              {
                vendorsFiltered.map((obj, index) => {
                  return <VendorCard
                    category="lucky Cement"
                    image="https://www.lucky-cement.com/wp-content/uploads/2017/02/cropped-lucky-logo.png"
                    navigateTo="Product"
                    navigation={navigation}
                    key={index}
                    data={obj}
                  />
                })
              }
            </View>
          )
        }

      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  headerTitleStyle: {
    color: "black",
    //fontFamily: 'Roboto-Bold',
    fontSize: 20,
  },
});
