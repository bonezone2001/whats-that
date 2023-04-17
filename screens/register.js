import { Text, TouchableOpacity, View } from "react-native";
import { mainStyle, entryStyle } from "@styles";
import TextInput from "@components/input";
import Button from "@components/button";
import { useState } from "react";

export default ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // handle login logic here
    console.log("Creating account...");
  };

  return (
    <View style={mainStyle.container}>
      <Text style={entryStyle.title}>Register</Text>

      {/* Login form */}
      <TextInput
        shape="rounded"
        style={{ marginBottom: 20 }}
        placeholder="First Name"
        ghost
        value={firstName}
        onChangeText={setFirstName}
        required
        block={80}
      />
      <TextInput
        shape="rounded"
        style={{ marginBottom: 20 }}
        placeholder="Last Name"
        ghost
        value={lastName}
        onChangeText={setLastName}
        required
        block={80}
      />
      <TextInput
        type="email-address"
        shape="rounded"
        style={{ marginBottom: 20 }}
        placeholder="Email Address"
        ghost
        value={email}
        onChangeText={setEmail}
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
      <TextInput
        type="password"
        shape="rounded"
        style={{ marginBottom: 20 }}
        placeholder="Confirm Password"
        ghost
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        required
        block={80}
      />
      <Button
        type="primary"
        block={80}
        onClick={handleRegister}
        shape="rounded"
      >
        CREATE ACCOUNT
      </Button>

      {/* Switch to login screen */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={entryStyle.touchableText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};
