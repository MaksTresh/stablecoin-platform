import React, { useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import { StyleSheet } from 'react-native';

const Charts = (props) => {
    let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })
    const [chartData, setChartData] = useState([3226.4, 3217.44, 3231.34, 3251.94, 3276.93, 3288.05, 3283.6, 3265.15, 3236.92, 3259.32, 3293.19, 3296.57, 3291.53, 3295.46]
        );

    return (
        <View style={styles.container}>
            <LineChart
                data={{
                    labels: ['21.10.2022', '22.10.2022', '25.10.2022', '26.10.2022', '27.10.2022', '28.10.2022', '29.10.2022', '01.11.2022', '02.11.2022', '03.11.2022', '04.11.2022', '08.11.2022', '09.11.2022', '10.11.2022'],
                    datasets: [
                        {
                            data: chartData
                        }
                    ]
                }}
                width={Dimensions.get("window").width * 0.95}
                height={250}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1}
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
                    borderRadius: 6
                }}

                decorator={() => {
                    return tooltipPos.visible ? <View>
                        <Svg >
                            <Rect 
                                borderRadius={30}
                                rx={5}
                                x={tooltipPos.x - 25} 
                                y={tooltipPos.y + 10} 
                                width="60" 
                                height="30"
                                fill="#09B99D" />
                                <TextSVG
                                    x={tooltipPos.x + 5}
                                    y={tooltipPos.y + 30}
                                    fill="white"
                                    fontSize="16"
                                    fontWeight="bold"
                                    textAnchor="middle">
                                    {tooltipPos.value}
                                </TextSVG>
                        </Svg>
                    </View> : null
                }}

                onDataPointClick={(data) => {

                    let isSamePoint = (tooltipPos.x === data.x 
                                        && tooltipPos.y === data.y)

                    isSamePoint ? setTooltipPos((previousState) => {
                        return { 
                                  ...previousState,
                                  value: data.value,
                                  visible: !previousState.visible
                               }
                    })
                        : 
                    setTooltipPos({ x: data.x, value: data.value, y: data.y, visible: true });

                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      margin: "5%"
    },
    decoratorStyle: {
      borderRadius: 30
    }
  });
  

export default Charts