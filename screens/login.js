import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { mainStyle, entryStyle } from "@styles";
import Button from "@components/button";
import { useState } from "react";

export default ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // handle login logic here
    console.log("Logging in...");
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
      <Button
        type="primary"
        block={80}
        onClick={handleLogin}
        shape="rounded"
        icon="🔑"
      >
        LOGIN
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={entryStyle.touchableText}>
          Don't have an account? Signup
        </Text>
      </TouchableOpacity>
    </View>
  );
};
