import { StyleSheet, ScrollView,Image, TextInput, TouchableOpacity } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import React, { useState } from "react";
import { Card } from 'react-native-elements';

export default function ChatScreen() {
  const [messages, setMessage] = useState("");
  const [charMessages, setChatMessages] = useState([{mes:"Добро пожаловать!", role: 0}]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {charMessages.map(x => {
          return <Card>
            <Text style={{fontWeight:"700"}}>{x.role == 0 ? "Поддержка" : "Вы"}</Text>
            <Text>{x.mes}</Text>
            </Card>
        })}
      </ScrollView>
      <View>
            <TextInput
                  style={styles.inputStyle}
                  onChangeText={(data) =>
                    setMessage(data)
                  }
                  placeholder="Введите сообщение"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  keyboardType='default'
                  returnKeyType="default"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
        </View>
        <View>
            <TouchableOpacity
                  style={styles.sendStyle}
                  onPress={() => {
                      setChatMessages(charMessages.concat({mes: messages, role: 1}).concat({mes: "Спасибо за Ваше обращение, на данный момент все операторы заняты, ожидайте, пожалуйста", role: 0}));
                      setMessage("");
                  }}
                >
                  <Text style={styles.sendStyle} >Отправить</Text>
                </TouchableOpacity>
          </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  containerStyle: {
    borderRadius: 11,
    padding: 0,
    background: "linearGradient(180deg, #005F50 43.23%, #103933 100%)"
  },
  mainContainer: {
    flexDirection: 'row'
  },
  rightSideContainer: {
    margin: '5%'
  },
  metalImageViewStyle: {
    width: '25%',
    backgroundColor: '#005F50',
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11
  },
  metalNameStyle: {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 18
  },
  metalPriceStyle: {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 39
  },
  metalPriceChangeStyle: {
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 10,
    lineHeight: 12
  },
  inputStyle: {
    marginTop: "5%",
    marginBottom: "5%",
    marginLeft: "3%",
    width: "95%",
    color: 'black',
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 20,
    lineHeight: 39,
    textAlign: "center",
    borderColor: '#dadae8',
  },
  sendStyle: {
    marginTop: "3%",
    marginBottom: "5%",
    marginLeft: "3%",
    width: "95%",
    color: 'black',
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 20,
    lineHeight: 39,
    textAlign: "center",
    borderColor: '#dadae8',
  }
});
