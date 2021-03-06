import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Picker,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from "react-redux";
import { createUser } from '../actions/authActions'
import Snackbar from '../Components/Snackbar'
import { Avatar } from 'react-native-elements'
import { showSnackbar } from "../actions/snackbarActions";


const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),

  country: Yup.string()
    .required("Required"),

  state: Yup.string(),
  city: Yup.string(),
  address: Yup.string()
    .required("Required"),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),

  phoneNumber: Yup.string()
    .required('Required')
    .min(11, "Invalid Number")
    .max(11, "Invalid Number"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password must be the same!')
    .required('Required'),

});



//import { ScrollView } from "react-native-gesture-handler";
const Register = ({ navigation, cities, countries, states, createUser, isLoading, showSnackbar }) => {

  const [profilePicture, setProfilePicture] = useState({ uri: "https://iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png" })
  let reqbody = {
    "FirstName": "string",
    "LastName": "string",
    "MiddleName": "string",
    "Username": "string",
    "EmailAddress": "string",
    "Avatar": "string",
    "Password": "string",
    "TypeOfUser": 1,
    "Id": 0,
    "IsDeleted": true,
    "Timestamp": "string",
    "Name": "string",
    "Description": "string"
  }

  const [country, setCountry] = React.useState("Pakistan");
  const [city, setCity] = React.useState("Karachi");
  const [state, setState] = React.useState("Sindh");
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const [filteredCountries, setCountries] = React.useState([]);
  const [filteredCities, setCities] = React.useState([]);
  const [filteredStates, setStates] = React.useState([]);
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        base64: true
      });
      if (!result.cancelled) {
        const imageNames = result.uri.split('/');
        const fileName = imageNames[imageNames.length - 1];
        result.fileName = fileName
        setProfilePicture(result)
      }
      console.log(result.uri)

    } catch (error) {
      console.log("Error While Picking Image", error)
    }
  };
  React.useEffect(() => {
    setCountries(countries);
    setCities(cities)
    setStates(states)
  }, [countries || cities || states])

  const onSubmitHandler = (values) => {
    const { firstName, lastName, email, password, address, phoneNumber, country, city, state } = values
    if (profilePicture.base64) {
      setUploadingImage(true)
      let body = reqbody;
      body.FirstName = firstName;
      body.LastName = lastName;
      body.EmailAddress = email;
      body.Password = password;
      body.Description = address;
      body.Name = phoneNumber;
      let base64Img = `data:image/jpg;base64,${profilePicture.base64}`

      //Add your cloud name
      let apiUrl = 'https://api.cloudinary.com/v1_1/dfczdwsx4/image/upload';

      let data = {
        "file": base64Img,
        "upload_preset": "ml_default",
      }

      fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
        let data = await r.json()
        console.log("Image Path", data.secure_url);
        body.Avatar = data.secure_url;
        setUploadingImage(false)

        createUser(body, navigation)

        // return data.secure_url
      }).catch(
        err => {
          setUploadingImage(true)
          showSnackbar("Error While Uploading Image")
          console.log(err)
        })
    } else {
      showSnackbar("Please Select Profile Picture!")
    }



  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Snackbar />
      <Image
        style={styles.bgImage}
        source={{
          uri:
            "https://mobilehd.blob.core.windows.net/main/2016/03/manhattan-empire-state-building-1080x1920.jpg",
        }}
      />
      <View>
        <Image
          style={styles.logo}
          source={{
            uri:
              "https://cdn.iconscout.com/icon/free/png-512/c-programming-569564.png",
          }}
        />
      </View>
      <Formik
        enableReinitialize
        initialValues={{ firstName: "", lastName: "", email: '', password: '', confirmPassword: "", address: "", phoneNumber: "", country: "", city: "", state: "" }}
        onSubmit={values => { onSubmitHandler(values) }}
        validationSchema={SignupSchema}>
        {({ handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
          <>

            <View style={[styles.inputContainer, errors.email && { borderColor: "red", borderWidth: 2 }]}>
              <TextInput
                style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid="transparent"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              //onChangeText={(email) => this.setState({email})}
              />
              <Image
                style={styles.inputIcon}
                source={{ uri: "https://img.icons8.com/nolan/40/000000/email.png" }}
              />
            </View>
            <View style={[styles.inputContainer, errors.firstName && { borderColor: "red", borderWidth: 2 }]}>
              <TextInput
                style={styles.inputs}
                placeholder="First Name"
                //keyboardType="email-address"
                underlineColorAndroid="transparent"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
              //onChangeText={(email) => this.setState({email})}
              />
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/metro/26/000000/user-male-circle.png",
                }}
              />
            </View>
            <View style={[styles.inputContainer, errors.lastName && { borderColor: "red", borderWidth: 2 }]}>
              <TextInput
                style={styles.inputs}
                placeholder="Last Name"
                //keyboardType="email-address"
                underlineColorAndroid="transparent"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
              //onChangeText={(email) => this.setState({email})}
              />

              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/metro/26/000000/user-male-circle.png",
                }}
              />
            </View>
            {/* <TouchableOpacity style={[styles.buttonContainer, styles.signupButton]}>
              <Text style={styles.btnText}>+ Upload Picture</Text>
            </TouchableOpacity> */}

            <View style={[styles.dropdownContainer]}>
              <Text style={{ fontSize: 18, color: 'black', borderBottomWidth: 2, borderBottomColor: 'grey' }}>Country</Text>
              <View style={[styles.picker, errors.country && { borderColor: "red", borderWidth: 2 }]}>
                <Picker
                  selectedValue={country}
                  style={{ height: 50, width: 300 }}
                  prompt="Country"

                  onBlur={handleBlur('country')}
                  onValueChange={(itemValue, itemIndex) => {
                    setFieldValue('country', itemValue)
                    setCountry(itemValue)
                  }
                  }
                >
                  <Picker.Item label="Select Country"
                    value="" />
                  {
                    filteredCountries.map((obj, key) => {
                      return <Picker.Item key={key} label={obj.name} value={obj.id} />
                    })
                  }
                </Picker>
              </View>
            </View>
            <View style={[styles.dropdownContainer]}>
              <Text style={{ fontSize: 18, color: 'black', borderBottomWidth: 2, borderBottomColor: 'grey' }}>State</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={state}
                  style={{ height: 50, width: 300 }}
                  prompt="State"
                  onBlur={handleBlur('state')}
                  onValueChange={(itemValue, itemIndex) => {
                    setState(itemValue)
                    setFieldValue('state', itemValue)
                  }
                  }
                >
                  <Picker.Item label="Select States" value="" />
                  {
                    filteredStates.map((obj, key) => {
                      return <Picker.Item key={key} label={obj.name} value={obj.id} />
                    })
                  }
                </Picker>
              </View>
            </View>
            <View style={[styles.dropdownContainer]}>
              <Text style={{ fontSize: 18, color: 'black', borderBottomWidth: 2, borderBottomColor: 'grey' }}>City</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={city}
                  style={{ height: 50, width: 300 }}
                  prompt="City"

                  onBlur={handleBlur('city')}
                  onValueChange={(itemValue, itemIndex) => {
                    setCity(itemValue)
                    setFieldValue('city', itemValue)

                  }
                  }
                >
                  <Picker.Item label="Select City" value="" />
                  {
                    filteredCities.map((obj, key) => {
                      return <Picker.Item key={key} label={obj.name} value={obj.id} />
                    })
                  }

                </Picker>
              </View>
            </View>


            <View style={[styles.inputContainer, errors.address && { borderColor: "red", borderWidth: 2 }]}>
              <TextInput
                style={styles.inputs}
                placeholder="Address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                //keyboardType="email-address"
                underlineColorAndroid="transparent"
              //onChangeText={(email) => this.setState({email})}
              />
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/wired/64/000000/address.png",
                }}
              />
            </View>
            <View style={[styles.inputContainer, errors.phoneNumber && { borderColor: "red", borderWidth: 2 }]}>
              <TextInput
                style={styles.inputs}
                placeholder="Contact Number"
                keyboardType="numeric"
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                underlineColorAndroid="transparent"
              //onChangeText={(email) => this.setState({email})}
              />
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/wired/64/000000/new-contact.png",
                }}
              />
            </View>

            <View style={[styles.inputContainer, errors.password && { borderColor: "red", borderWidth: 2 }]}>
              <TextInput
                style={styles.inputs}
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry={true}
                underlineColorAndroid="transparent"
              // onChangeText={(password) => this.setState({password})}
              />
              <Image
                style={styles.inputIcon}
                source={{ uri: "https://img.icons8.com/nolan/40/000000/key.png" }}
              />
            </View>
            <View style={[styles.inputContainer, errors.confirmPassword && { borderColor: "red", borderWidth: 2 }]}>
              <TextInput
                style={styles.inputs}
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                underlineColorAndroid="transparent"
              // onChangeText={(password) => this.setState({password})}
              />
              <Image
                style={styles.inputIcon}
                source={{ uri: "https://img.icons8.com/nolan/40/000000/key.png" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Avatar
                size="xlarge"
                rounded
                source={{
                  uri:
                    profilePicture.uri,
                }}
              >
                <Avatar.Accessory onPress={() => { pickImage() }}
                  iconStyle={{ fontSize: 20 }} style={{ height: 40, width: 40, backgroundColor: '#2A83F7', borderRadius: 50 }} >

                </Avatar.Accessory>

              </Avatar>


            </View>
            {
              isLoading || uploadingImage
                ? (
                  <ActivityIndicator size="large" color="#03254c" />
                )
                : (
                  <TouchableOpacity
                    style={[styles.buttonContainer, styles.signupButton]}
                    onPress={handleSubmit}

                  >
                    <Text style={styles.btnText}>Register</Text>
                  </TouchableOpacity>
                )

            }


          </>
        )}
      </Formik>

      <View style={{ marginBottom: "10%" }}></View>
    </ScrollView>
  );
};

const mapStateToProps = state => ({
  countries: state.generalReducer.countries,
  states: state.generalReducer.states,
  cities: state.generalReducer.cities,
  isLoading: state.authReducer.isLoading
})


export default connect(mapStateToProps, { createUser, showSnackbar })(Register)


const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  container: {
    marginTop: '7%',
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCDCDC",
  },
  picker: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  dropdownConatiner: {
    width: 300,
    height: 45,

    marginBottom: 20,
    flexDirection: "row",
    //    alignItems: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  btnForgotPassword: {
    height: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 10,
    width: 300,
    backgroundColor: "transparent",
  },
  loginButton: {
    backgroundColor: "#00b5ec",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },

  signupButton: {
    backgroundColor: "#00b5ec",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
  loginText: {
    color: "white",
  },
  bgImage: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    opacity: 0.3,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});
