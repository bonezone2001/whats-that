import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { mainStyle, entryStyle } from "@styles";
import { useState } from "react";

export default ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // handle login logic here
    console.log("Creating account...");
  };

  return (
    <View style={mainStyle.container}>
      <Text style={entryStyle.title}>WhatsThat</Text>
      <View style={entryStyle.inputView}>
        <TextInput
          style={entryStyle.inputText}
          placeholder="Username"
          placeholderTextColor="#fff"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={entryStyle.inputView}>
        <TextInput
          secureTextEntry
          style={entryStyle.inputText}
          placeholder="Password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={entryStyle.btn} onPress={handleRegister}>
        <Text style={entryStyle.btnText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={entryStyle.touchableText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};