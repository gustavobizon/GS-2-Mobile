import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker, ScrollView } from 'react-native';
import { Line, Bar, Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import NavBar from './NavBar';

export default function GraphScreen({ route }) {
  const [sensorData, setSensorData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('lastHour');
  
  const { token, username } = route.params;

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const filteredData = filterSensorData(data);
        setSensorData(filteredData);
      } catch (error) {
        console.error('Erro ao buscar dados dos sensores:', error);
      }
    };

    fetchSensorData();
  }, [token, timeRange]);

  const filterSensorData = (data) => {
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
          return true; 
        default:
          return true;
      }
    });
  };

  const createChartData = (label, dataKey, color) => ({
    labels: sensorData.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label,
        data: sensorData.map(item => item[dataKey]),
        backgroundColor: color,
        borderColor: color,
        fill: false,
        tension: 0.1,
      },
    ],
  });

  const tempData = createChartData('Temperatura', 'temperatura', 'rgba(255, 0, 0, 1)');
  const umiData = createChartData('Umidade', 'umidade', 'rgba(0, 0, 255, 1)');
  const vibData = createChartData('Vibração', 'vibracao', 'rgba(0, 255, 0, 1)');

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo',
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

  const renderChart = (data) => {
    switch (chartType) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'radar':
        return <Radar data={data} options={options} />;
      default:
        return <Line data={data} options={options} />;
    }
  };


  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Gráfico de Dados dos Sensores</Text>

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
          <Picker.Item label="Radar" value="radar" />
        </Picker>

        <Text style={styles.chartLabel}>Temperatura</Text>
        <View style={styles.chartContainer}>
          {renderChart(tempData)}
        </View>

        <Text style={styles.chartLabel}>Umidade</Text>
        <View style={styles.chartContainer}>
          {renderChart(umiData)}
        </View>

        <Text style={styles.chartLabel}>Vibração</Text>
        <View style={styles.chartContainer}>
          {renderChart(vibData)}
        </View>
        <NavBar/>
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
  picker: {
    height: 40,
    width: 150,
    marginBottom: 20,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
  chartLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  chartContainer: {
    height: 300,
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
});
