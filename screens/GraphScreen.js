import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker, ScrollView, TouchableOpacity } from 'react-native';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
          // Organizar os dados de temperatura para os gráficos
          const organizedTempData = {
            labels: data.map((item) => item.timestamp),
            datasets: [
              {
                label: 'Temperatura no Quarto',
                data: data.filter((item) => item.ambiente === 'quarto' && item.tipo_sensor === 'temperatura').map((item) => item.valor),
                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                borderColor: 'rgba(255, 0, 0, 1)',
                fill: true,
              },
              {
                label: 'Temperatura na Sala',
                data: data.filter((item) => item.ambiente === 'sala' && item.tipo_sensor === 'temperatura').map((item) => item.valor),
                backgroundColor: 'rgba(0, 0, 255, 0.6)',
                borderColor: 'rgba(0, 0, 255, 1)',
                fill: true,
              },
            ],
          };

          // Organizar os dados de luz para o gráfico
          const organizedLightData = {
            labels: data.filter((item) => item.tipo_sensor === 'luz').map((item) => item.timestamp),
            datasets: [
              {
                label: 'Estado da Luz',
                data: data.filter((item) => item.tipo_sensor === 'luz').map((item) => item.valor === 1 ? 'Ligada' : 'Desligada'),
                backgroundColor: 'rgba(0, 255, 0, 0.6)',
                borderColor: 'rgba(0, 255, 0, 1)',
                fill: false,
              },
            ],
          };

          setSensorData(organizedTempData);
          setLightData(organizedLightData);
        } else {
          console.error('Formato inesperado dos dados recebidos:', data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchSensorData();
  }, [token, timeRange]);

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
    if (!sensorData || sensorData.datasets.length === 0) {
      return <Text>Nenhum dado de temperatura disponível para exibição</Text>;
    }

    return chartType === 'line' ? (
      <Line data={sensorData} options={options} />
    ) : (
      <Bar data={sensorData} options={options} />
    );
  };

  const renderLightChart = () => {
    if (!lightData || lightData.datasets.length === 0) {
      return <Text>Nenhum dado de luz disponível para exibição</Text>;
    }

    return chartType === 'line' ? (
      <Line data={lightData} options={options} />
    ) : (
      <Bar data={lightData} options={options} />
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
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
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => navigation.navigate('IotScreen', { token })}
        >
          <Icon name="devices" size={24} color="#fff" />
          <Text style={styles.navigationButtonText}>IotScreen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
