import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, user } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    await signIn(email, password);
    if (user) router.push("/"); // go to dashboard
  };

  const handleSignup = async () => {
    await signUp(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 8 },
});
