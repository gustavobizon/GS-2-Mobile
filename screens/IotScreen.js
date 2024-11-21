import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';

export default function IotScreen({ route, navigation }) {
  const [roomValues, setRoomValues] = useState({ quarto: 0, sala: 0 });
  const [lightStatus, setLightStatus] = useState({
    quarto: false,
    sala: false,
    cozinha: false,
    banheiro: false,
  });

  const [temperatureStatus, setTemperatureStatus] = useState({
    quarto: false,
    sala: false,
  });

  const toggleTemperatureStatus = (room) => {
    setTemperatureStatus((prevStatus) => {
      const newStatus = !prevStatus[room];
      
      if (!newStatus) {
        setRoomValues((prevValues) => ({ ...prevValues, [room]: 0 }));
      }
      return { ...prevStatus, [room]: newStatus };
    });
  };

  const [iconColors, setIconColors] = useState({
    quarto: '#000',
    sala: '#000',
    cozinha: '#000',
    banheiro: '#000',
  }); 

  const [randomNumbers, setRandomNumbers] = useState({
    quarto: 0,
    sala: 0,
    cozinha: 0,
    banheiro: 0,
  }); 

  const { token, username } = route.params;

  const generateRandomNumbers = () => {
    const newRandomNumbers = {};
    const newIconColors = {};
    const newButtonColors = {};

    // Gera um número aleatório para cada ambiente
    ['quarto', 'sala', 'cozinha', 'banheiro'].forEach((room) => {
      const number = Math.floor(Math.random() * 11);
      newRandomNumbers[room] = number;
      newIconColors[room] = number < 5 ? 'black' : 'blue';
      newButtonColors[room] = number < 5 ? 'black' : 'blue';
    });

    setRandomNumbers(newRandomNumbers);
    setIconColors(newIconColors);
    setButtonColors(newButtonColors);
  };

  useEffect(() => {
    generateRandomNumbers();
  
    const interval = setInterval(generateRandomNumbers, 25000);
  
    return () => clearInterval(interval);
  }, []);
  

  // Função para alterar a temperatura
  const handleChangeTemperature = (room, value) => {
    if (room === 'quarto' || room === 'sala') {
      const newTemp = Math.min(Math.max(value, 15), 29); 
      setRoomValues((prevValues) => ({ ...prevValues, [room]: newTemp }));
    }
  };

  const [buttonColors, setButtonColors] = useState({
    quarto: '#000', 
    sala: '#000',
  })
  // Função para alternar o estado da luz
  const toggleLight = (room) => {
    const newStatus = !lightStatus[room];
    setLightStatus((prevStatus) => ({ ...prevStatus, [room]: newStatus }));
    setButtonColors((prevColors) => ({
      ...prevColors,
      [room]: newStatus ? '#007bff' : '#000', // Azul quando ligado, preto quando desligado
    }));
  };

  // Função para enviar dados para o servidor
  const sendDataToServer = async () => {
    try {
      const dataToSend = [];

      Object.keys(roomValues).forEach((room) => {
        const temperature = temperatureStatus[room] ? roomValues[room] : roomValues[room];
      dataToSend.push({
        sensor_id: room === 'quarto' ? 1 : 2,
        tipo_sensor: 'temperatura',
        ambiente: room,
        valor: temperature,
      });});

      Object.keys(lightStatus).forEach((room) => {
        const lightStatusValue = lightStatus[room];
        dataToSend.push({
          sensor_id: room === 'quarto' ? 1 : 2,
          tipo_sensor: 'luz',
          ambiente: room,
          valor: lightStatusValue ? 1 : 0,
        });
      });

      if (dataToSend.length > 0) {
        const response = await fetch('http://localhost:3000/dados-sensores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        });

        const data = await response.json();
        console.log('Dados enviados para o servidor', data);
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

  // Função para buscar os dados do servidor ao entrar na página
  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://localhost:3000/dados-sensores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const roomData = {
        quarto: null,
        sala: null,
      };

      const lightData = {
        quarto: false,
        sala: false,
        cozinha: false,
        banheiro: false,
      };

      data.forEach(item => {
        if (item.tipo_sensor === 'temperatura' && (item.ambiente === 'quarto' || item.ambiente === 'sala')) {
          roomData[item.ambiente] = Math.min(Math.max(item.valor, 0), 29); 
        } else if (item.tipo_sensor === 'luz') {
          lightData[item.ambiente] = item.valor === 1;
        }
      });

      setRoomValues(roomData);
      setLightStatus(lightData);

      console.log('Dados dos sensores:', data);
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  useEffect(() => {
    fetchSensorData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Temperatura</Text>
        <View style={styles.roomsContainer}>
        {['quarto', 'sala'].map((room) => (
            <View key={room} style={styles.roomContainer}>
              <Text style={styles.roomTitle}>{room.charAt(0).toUpperCase() + room.slice(1)}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.roundButton}
                  onPress={() => handleChangeTemperature(room, roomValues[room] + 1)}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.numberText}>
                { roomValues[room]}
              </Text>
                <TouchableOpacity
                  style={styles.roundButton}
                  onPress={() => handleChangeTemperature(room, roomValues[room] - 1)}>
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.powerButton}
                onPress={() => toggleTemperatureStatus(room)}
              >
                <PowerSettingsNewRoundedIcon
                  color={temperatureStatus[room] ? 'green' : 'red'}
                  style={styles.powerIcon}
                />
              </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Luzes</Text>
        <View style={styles.roomsContainer}>
          {['quarto', 'sala', 'cozinha', 'banheiro'].map((room) => (
            <View key={room} style={styles.roomContainer}>
              <Text style={styles.roomTitle}>{room.charAt(0).toUpperCase() + room.slice(1)}</Text>
              <TouchableOpacity
                style={[styles.lightButton, { backgroundColor: lightStatus[room] ? '#ffcc00' : '#ccc' }]}
                onPress={() => toggleLight(room)}  
              >
                <Icon
                  name={lightStatus[room] ? 'lightbulb' : 'lightbulb-outline'}
                  size={30}
                  color={lightStatus[room] ? '#fff' : '#000'}
                />
              </TouchableOpacity>
              <Icon
                name="person"
                size={30}
                color={iconColors[room]} 
                style={styles.personIcon}
              />
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.sendButton}
        onPress={sendDataToServer}
      >
        <Icon name="send" size={30} color="#fff" />
        <Text style={styles.sendButtonText}>Enviar Dados</Text>
      </TouchableOpacity>
      <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 3,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity
        style={styles.navigationButton}
        onPress={() => navigation.navigate('GraphScreen', { token })}
      >
        <Icon name="bar-chart" size={24} color="#fff" />
        <Text style={styles.navigationButtonText}>GraphScreen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navigationButton}
        onPress={() => navigation.navigate('IotScreen', { token })}
      >
        <Icon name="devices" size={24} color="#fff" />
        <Text style={styles.navigationButtonText}>IotScreen</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  navigationButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    width: 140,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  roomsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roomContainer: {
    alignItems: 'center',
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundButton: {
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  lightButton: {
    padding: 10,
    borderRadius: 50,
    marginVertical: 10,
  },
  personIcon: {
    marginTop: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});