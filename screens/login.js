import { Text, TouchableOpacity, View } from "react-native";
import { mainStyle, entryStyle } from "@styles";
import TextInput from "@components/input";
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

      {/* Login form */}
      <TextInput
        shape="rounded"
        style={{ marginBottom: 20 }}
        placeholder="Username"
        ghost
        value={username}
        onChangeText={setUsername}
        required
        block={80}
      />
      <TextInput
        type="password"
        shape="rounded"
        style={{ marginBottom: 20 }}
        placeholder="Password"
        ghost
        value={password}
        onChangeText={setPassword}
        required
        block={80}
      />
      <Button
        type="primary"
        block={80}
        onClick={handleLogin}
        shape="rounded"
      >
        LOGIN
      </Button>

      {/* Switch to signup screen */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={entryStyle.touchableText}>
          Don't have an account? Signup
        </Text>
      </TouchableOpacity>
    </View>
  );
};
