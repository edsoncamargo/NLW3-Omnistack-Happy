import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

interface Params {
  position: {
    latitude: number,
    longitude: number
  }
}

interface Orphanage {
  name: string,
  latitude: number,
  longitude: number,
  about: string,
  instructions: string,
  openingHours: string,
  openOnWeekends: boolean,
  images: [
    {
      id: number,
      url: string,
    }
  ]
}

export default function OrphanageData() {

  const navigation = useNavigation();

  const routes = useRoute();
  const params = routes.params as Params;
  const { latitude, longitude } = params.position;
  const [name, setName] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [openingHours, setOpeningHours] = useState<string>('');
  const [openOnWeekends, setOpenOnWeekends] = useState<boolean>(true);
  const [images, setImages] = useState<string[]>([]);

  async function handleSelectedImages() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    if (status !== 'granted') {
      alert('Ops, precisamos do acesso à sua galeria.')
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (result.cancelled) {
      return;
    }

    const { uri: image } = result;
    setImages([...images, image]);
  }

  async function handleCreateOrphanage() {
    const data = new FormData();
    data.append('name', name);
    data.append('about', about);
    data.append('latitude', latitude.toString());
    data.append('longitude', longitude.toString());
    data.append('instructions', instructions);
    data.append('openingHours', openingHours);
    data.append('openOnWeekends', openOnWeekends.toString())
    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image
      } as any)
    })
    await api.post('/api/v1/orphanages', data);
    navigation.navigate('OrphanagesMap');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={about}
        onChangeText={setAbout}
      />

      <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      />

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.imagesContainer}>
        {
          images.map(image => {
            return (
              <Image
                key={image}
                source={{ uri: image }}
                style={styles.images}
              />
            )
          })
        }
      </View>
      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectedImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={openingHours}
        onChangeText={setOpeningHours}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={openOnWeekends}
          onValueChange={setOpenOnWeekends}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Raleway_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },
  label: {
    color: '#8fa7b3',
    fontFamily: 'Raleway_700Bold',
    marginBottom: 8,
  },
  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },
  nextButtonText: {
    fontFamily: 'Raleway_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  images: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginTop: 8,
  }
})