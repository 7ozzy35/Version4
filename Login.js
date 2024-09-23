import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import data from './data.json'; // JSON dosyasını import et

export default function App() {
  const [phone, setPhone] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // AsyncStorage'den temayı yükleme
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('darkMode');
      if (storedTheme !== null) {
        setDarkMode(JSON.parse(storedTheme));
      }
    };
    loadTheme();
  }, []);

  // Temayı değiştirip AsyncStorage'e kaydetme
  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  // Giriş yapma işlemi
  const handleLogin = () => {
    const client = data.clients.find((client) => client.Phone === phone);
    const card = data.cards.find((card) => card.CardNo === cardNo && card.ClientID === client?.ID);

    if (client && card) {
      Alert.alert('Başarılı', `Hoşgeldiniz, ${client.Name}`);
    } else {
      Alert.alert('Hata', 'Geçersiz telefon veya kart numarası!');
    }
  };

  // Kayıt olma işlemi (sadece alert gösteriyor)
  const handleRegister = () => {
    Alert.alert('Kayıt', 'Kayıt olma işlemi henüz aktif değil.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}
    >
      <View style={styles.header}>
        <Text style={{ color: darkMode ? '#fff' : '#000', fontSize: 16, marginRight: 10 }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Phone"
        placeholderTextColor={darkMode ? '#ccc' : '#666'}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Card No"
        placeholderTextColor={darkMode ? '#ccc' : '#666'}
        value={cardNo}
        onChangeText={setCardNo}
        keyboardType="numeric"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.buttonSpacing} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#555',
    color: '#fff',
  },
  lightInput: {
    backgroundColor: '#fff',
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonSpacing: {
    height: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
