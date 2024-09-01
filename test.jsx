import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import BPDataDisplay from '../../components/BPData';
import { StackActions, useNavigation } from '@react-navigation/native';


export default function BPCheckin() {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const navigation = useNavigation();


  const handleInputChange = (value, setter) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 300) {
      setter(value);
    } else if (value === '') {
      setter(''); // Allow empty input for clearing the field
    }
  };

  const handleSubmit = async () => {
    if (systolic && diastolic) {
      try {
        const user = auth().currentUser;
        if (user) {
          const email = user.email;

          await firestore()
            .collection('bloodPressure')
            .doc(email) // Use email as the document ID for the user
            .collection('records')
            .add({
              systolic: parseInt(systolic, 10),
              diastolic: parseInt(diastolic, 10),
              timestamp: firestore.FieldValue.serverTimestamp(), // Timestamp when the record was created
            });

            await firestore()
            .collection('bloodPressure')
            .doc(email) // Use email as the document ID for the user
            .set({
              systolic: parseInt(systolic, 10),
              diastolic: parseInt(diastolic, 10),
              timestamp: firestore.FieldValue.serverTimestamp(), // Timestamp when the record was created
            });

          

          Alert.alert('Success', 'Blood pressure recorded successfully');
          setSystolic('');
          setDiastolic('');
        } else {
          Alert.alert('Error', 'User not authenticated');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to record blood pressure');
        console.error(error);
      }
    } else {
      Alert.alert('Error', 'Please enter both systolic and diastolic values.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator= {false}>
        <View style= {{padding: 20}}>

          <View style={styles.newSection}>
            <Text style={styles.sectionText}>Log Your Blood Pressure</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Systolic Blood Pressure</Text>
            <TextInput
              style={styles.input}
              value={systolic}
              onChangeText={(value) => handleInputChange(value, setSystolic)}
              placeholder="Systolic (e.g., 120)"
              keyboardType="numeric" // Ensure numeric keyboard appears
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Diastolic Blood Pressure</Text>
            <TextInput
              style={styles.input}
              value={diastolic}
              onChangeText={(value) => handleInputChange(value, setDiastolic)}
              placeholder="Diastolic (e.g., 80)"
              keyboardType="numeric" // Ensure numeric keyboard appears
            />
          </View>

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>

        </View>


        <BPDataDisplay />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button:{
      width: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      backgroundColor: '#3478c6',
      borderRadius: 20,
      marginTop: 30
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  newSection: {
    marginTop: 20,
    marginBottom: 30,
    justifyContent: 'center',
  },
  sectionText: {
    fontSize: 40,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left',
    flexWrap: 'wrap', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});