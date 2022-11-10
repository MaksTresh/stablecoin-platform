import {
    LineChart
  } from "react-native-chart-kit";
import { Dimensions } from 'react-native';
import React, {useState,useEffect} from 'react';
import { Text, View } from '../Themed';
import { StyleSheet } from 'react-native';
import { Rect, Text as TextSVG, Svg } from "react-native-svg";

export default function CoinChart() {
  const [chartData, setChartData] = useState([
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100
      ]);

    var ws = new WebSocket('ws://host.com/path');

    ws.onopen = () => {
      // connection opened
      ws.send('something'); // send a message
    };
    
    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
    };
    
    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };
    
    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };

  return (
    <View style={styles.container}>
        <LineChart
        data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
            {
                data: chartData
            }
            ]
        }}
        width={Dimensions.get("window").width * 0.95} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
            backgroundColor: "#000000",
            backgroundGradientFrom: "#005F50",
            backgroundGradientTo: "#09B99D",
            decimalPlaces: 2, 
            color: (opacity = 1) => `#09B99D`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
            borderRadius: 16
            },
            propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffffff"
            }
        }}
        bezier
        style={{
            marginVertical: 8,
            borderRadius: 16
        }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      margin: "5%"
    },
    decoratorStyle: {
      color: "red"
    }
  });
  