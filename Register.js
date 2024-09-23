import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const handleRegister = async () => {
    if (!name || !password || !phone || !email || !flatNo) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    const newClient = {
      ID: Date.now(),
      Name: name,
      Password: password,
      CreatedDateTime: new Date().toISOString(),
      Address: address,
      City: city,
      Country: country,
      Email: email,
      Phone: phone,
      Enable: 1,
      Credit: 0,
    };

    const newCard = {
      ID: Date.now(),
      CardNo: (Math.random() * 100000).toFixed(0),
      Name: name,
      Phone: phone,
      FlatNo: flatNo,
      Credit: 0,
      ClientID: newClient.ID,
    };

    try {
        const response = await fetch('http://192.168.1.88:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ client: newClient, card: newCard }),
        });
      
        const textResponse = await response.text(); // Yanıtı metin olarak al
        console.log("Yanıt:", textResponse); // Yanıtı konsola yazdır
      
        const result = JSON.parse(textResponse); // JSON'a dönüştürmeye çalış
      
        if (response.ok) {
          Alert.alert('Başarılı', 'Kayıt başarılı!');
        } else {
          Alert.alert('Hata', result.message || 'Kayıt işlemi başarısız oldu.');
        }
      } catch (error) {
        console.log("makarinaaaa");
        console.error(error);
        Alert.alert('Hata', 'Sunucuya bağlanırken bir hata oluştu.');
      }
      
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput style={styles.input} placeholder="Ad Soyad" value={name} onChangeText={setName} placeholderTextColor="#333" />
      <TextInput style={styles.input} placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#333" />
      <TextInput style={styles.input} placeholder="Daire No" value={flatNo} onChangeText={setFlatNo} keyboardType="numeric" placeholderTextColor="#333" />
      <TextInput style={styles.input} placeholder="Telefon" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor="#333" />
      <TextInput style={styles.input} placeholder="E-posta" value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor="#333" />
      <TextInput style={styles.input} placeholder="Adres" value={address} onChangeText={setAddress} placeholderTextColor="#333" />
      <TextInput style={styles.input} placeholder="Şehir" value={city} onChangeText={setCity} placeholderTextColor="#333" />
      <TextInput style={styles.input} placeholder="Ülke" value={country} onChangeText={setCountry} placeholderTextColor="#333" />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5', // Krem rengi arka plan
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', // Siyahın biraz açık tonu
  },
  input: {
    borderWidth: 1,
    borderColor: '#333', // Siyahın biraz açık tonu
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: '#333', // Siyahın biraz açık tonu
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
