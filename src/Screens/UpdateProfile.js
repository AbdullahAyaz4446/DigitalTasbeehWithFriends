import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
    Modal,
    ScrollView,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { useNavigation } from "@react-navigation/native";
  import Ionicons from "react-native-vector-icons/Ionicons";
  import { colors } from "../utiles/colors";
  import * as ImagePicker from "react-native-image-picker";
  
  const UpdateProfile = () => {
    const navigation = useNavigation();
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [Username, setName] = useState("");
    const [imageURI, setImageURI] = useState(null);
    const [showModal, setShowModal] = useState(false);
  
    // Fetch current user profile (use your API for real data)
    useEffect(() => {
      // Placeholder: Fetch user data from API or local storage
      const currentUser = {
        username: "currentUsername",
        email: "currentEmail@example.com",
        profilePic: null, // Replace with real profile picture URL if available
      };
      setName(currentUser.username);
      setEmail(currentUser.email);
      if (currentUser.profilePic) {
        setImageURI(currentUser.profilePic);
      }
    }, []);
  
    const updateProfile = async () => {
      if (Password === cpassword) {
        const formData = new FormData();
        const updatedUser = {
          Username: Username,
          Email: Email,
          password: Password,
        };
        formData.append("User", JSON.stringify(updatedUser));
  
        if (imageURI) {
          var myImage = {
            uri: imageURI,
            name: `${Username}.jpg`,
            type: "image/jpeg",
          };
          formData.append("file", myImage);
        }
  
        try {
          const response = await fetch("YOUR_API_URL/UpdateProfile", {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          });
  
          if (response.ok) {
            const ans = await response.text();
            console.log(ans);
            navigation.goBack();
          } else {
            const ans = await response.text();
            console.log(ans);
          }
        } catch (error) {
          console.log(error.message);
        }
      } else {
        console.log("Passwords do not match");
      }
    };
  
    const openCamera = () => {
      ImagePicker.launchCamera({ mediaType: "photo" }, (response) => {
        if (response.assets && response.assets.length > 0) {
          setImageURI(response.assets[0].uri);
          setShowModal(false);
        }
      });
    };
  
    const openGallery = () => {
      ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
        if (response.assets && response.assets.length > 0) {
          setImageURI(response.assets[0].uri);
          setShowModal(false);
        }
      });
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-sharp" size={40} color="#000" />
        </TouchableOpacity>
  
        <View style={styles.textcontainer}>
          <Text style={styles.headingtext}>Update Profile</Text>
        </View>
  
        <View style={styles.imageContainer}>
          {imageURI ? (
            <Image source={{ uri: imageURI }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={60} color="#fff" />
            </View>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addButtonText}>Update Profile Photo</Text>
          </TouchableOpacity>
        </View>
  
        {/* ScrollView for input fields */}
        <ScrollView style={styles.inputScroll}>
          <View style={styles.inputcontainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, { color: "black" }]}
              placeholder="Enter your username"
              placeholderTextColor="#A9A9A9"
              value={Username}
              onChangeText={setName}
            />
          </View>
  
          <View style={styles.inputcontainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { color: "black" }]}
              placeholder="Enter your Email"
              placeholderTextColor="#A9A9A9"
              value={Email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
  
          <View style={styles.inputcontainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, { color: "black" }]}
              placeholder="Enter your Password"
              placeholderTextColor="#A9A9A9"
              value={Password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
  
          <View style={styles.inputcontainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, { color: "black" }]}
              placeholder="Confirm your Password"
              placeholderTextColor="#A9A9A9"
              value={cpassword}
              onChangeText={setCPassword}
              secureTextEntry
            />
          </View>
        </ScrollView>
  
        <TouchableOpacity onPress={updateProfile} style={styles.button}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
  
        <Modal transparent visible={showModal} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalHeading}>Select Option</Text>
              <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
                <Text style={styles.optionText}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
                <Text style={styles.optionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: "red" }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.optionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  export default UpdateProfile;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    textcontainer: {
      marginVertical: 5,
    },
    inputcontainer: {
      marginVertical: 5,
    },
    headingtext: {
      fontSize: 45,
      color: "black",
      fontWeight: "bold",
    },
    label: {
      color: "black",
      fontWeight: "bold",
      fontSize: 20,
      paddingLeft: 10,
    },
    input: {
      height: 50,
      borderColor: "#000",
      borderWidth: 1,
      padding: 10,
      borderRadius: 100,
    },
    inputScroll: {
      flexGrow: 0,
      maxHeight: 300, 
    },
    imageContainer: {
      alignItems: "center",
      marginVertical: 20,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 10,
    },
    placeholderImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    addButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 10,
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 60,
      borderRadius: 30,
      marginTop: 30,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 24,
      textAlign: "center",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: "#fff",
      width: "80%",
      borderRadius: 10,
      padding: 20,
    },
    modalHeading: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    optionButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
    },
    optionText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
  });
  