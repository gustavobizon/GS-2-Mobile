import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

export default function GraphScreen({ route, navigation }) {
  const [sensorData, setSensorData] = useState(null);
  const [lightData, setLightData] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('lastHour');
  const { token } = route.params;

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setSensorData(data); // Dados brutos
          setLightData(data); // Dados brutos
        } else {
          console.error('Formato inesperado dos dados recebidos:', data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchSensorData();
  }, [token]);

  const filterDataByTimeRange = (data) => {
    const now = new Date();
    return data.filter(item => {
      const itemDate = new Date(item.timestamp);
      switch (timeRange) {
        case 'lastHour':
          return itemDate >= new Date(now - 60 * 60 * 1000);
        case 'last24Hours':
          return itemDate >= new Date(now - 24 * 60 * 60 * 1000);
        case 'lastWeek':
          return itemDate >= new Date(now - 7 * 24 * 60 * 60 * 1000);
        case 'last30Days':
          return itemDate >= new Date(now - 30 * 24 * 60 * 60 * 1000);
        case 'allData':
        default:
          return true;
      }
    });
  };

  const prepareTemperatureData = () => {
    if (!sensorData) return null;

    const filteredData = filterDataByTimeRange(sensorData);

    return {
      labels: filteredData
        .map((item) => item.timestamp)
        .filter((timestamp) => timestamp !== null && timestamp !== undefined),
      datasets: [
        {
          label: 'Temperatura no Quarto',
          data: filteredData
            .filter((item) => item.ambiente === 'quarto' && item.tipo_sensor === 'temperatura' && item.valor !== null)
            .map((item) => item.valor),
          backgroundColor: 'rgba(255, 0, 0, 0.6)',
          borderColor: 'rgba(255, 0, 0, 1)',
          fill: true,
        },
        {
          label: 'Temperatura na Sala',
          data: filteredData
            .filter((item) => item.ambiente === 'sala' && item.tipo_sensor === 'temperatura' && item.valor !== null)
            .map((item) => item.valor),
          backgroundColor: 'rgba(0, 0, 255, 0.6)',
          borderColor: 'rgba(0, 0, 255, 1)',
          fill: true,
        },
      ],
    };
  };

  const prepareLightData = () => {
    if (!lightData) return null;

    const filteredData = filterDataByTimeRange(lightData);

    const roomColors = {
      quarto: 'rgba(255, 0, 0, 0.6)',
      sala: 'rgba(0, 0, 255, 0.6)',
      cozinha: 'rgba(0, 255, 0, 0.6)',
      banheiro: 'rgba(255, 255, 0, 0.6)',
    };

    const datasets = ['quarto', 'sala', 'cozinha', 'banheiro'].map((room) => {
      const roomData = filteredData.filter(
        (item) => item.tipo_sensor === 'luz' && item.ambiente === room && item.valor !== null
      );

      if (roomData.length > 0) {
        return {
          label: `Estado da Luz - ${room}`,
          data: roomData.map((item) => (item.valor === 1 ? 1 : 0)),
          backgroundColor: roomColors[room],
          borderColor: roomColors[room],
          fill: false,
        };
      }
      return null;
    });

    return {
      labels: filteredData
        .filter((item) => item.tipo_sensor === 'luz' && item.timestamp !== null)
        .map((item) => item.timestamp),
      datasets: datasets.filter(Boolean),
    };
  };

  const temperatureData = prepareTemperatureData();
  const lightDataPrepared = prepareLightData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Data e Hora',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valor',
        },
        beginAtZero: true,
      },
    },
  };

  const renderTemperatureChart = () => {
    if (!temperatureData || temperatureData.datasets.length === 0) {
      return <Text>Nenhum dado de temperatura disponível para exibição</Text>;
    }

    return chartType === 'line' ? (
      <Line data={temperatureData} options={options} />
    ) : (
      <Bar data={temperatureData} options={options} />
    );
  };

  const renderLightChart = () => {
    if (!lightDataPrepared || lightDataPrepared.datasets.length === 0) {
      return <Text>Nenhum dado de luz disponível para exibição</Text>;
    }

    return chartType === 'line' ? (
      <Line data={lightDataPrepared} options={options} />
    ) : (
      <Bar data={lightDataPrepared} options={options} />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Gráficos de Consumo e Eficiência Energética</Text>

        <Picker
          selectedValue={timeRange}
          style={styles.picker}
          onValueChange={(itemValue) => setTimeRange(itemValue)}
        >
          <Picker.Item label="Última Hora" value="lastHour" />
          <Picker.Item label="Últimas 24 Horas" value="last24Hours" />
          <Picker.Item label="Última Semana" value="lastWeek" />
          <Picker.Item label="Últimos 30 Dias" value="last30Days" />
          <Picker.Item label="Todos os Dados" value="allData" />
        </Picker>

        <Picker
          selectedValue={chartType}
          style={styles.picker}
          onValueChange={(itemValue) => setChartType(itemValue)}
        >
          <Picker.Item label="Linha" value="line" />
          <Picker.Item label="Barra" value="bar" />
        </Picker>

        <View style={styles.chartContainer}>
          <Text style={styles.subTitle}>Temperatura</Text>
          {renderTemperatureChart()}

          <Text style={styles.subTitle}>Estado da Luz</Text>
          {renderLightChart()}
        </View>
      </ScrollView>
      <View style={styles.footer}>
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
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderColor: 'transparent',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    marginBottom: 20,
  },
  chartContainer: {
    height: 300,
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 100,  
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 3,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
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
});
