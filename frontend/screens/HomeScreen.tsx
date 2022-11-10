import React, {useState,useRef} from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as SecureStore from 'expo-secure-store';
import {userInfo,replenish,getCurrencies} from "../api/requests";
import MetalCard from '../components/Metal/MetalCard';
import GoodModel from '../components/Goods/GoodModel';

const wait = (timeout : any) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const getIconByDef = (def : string) => {
  switch(def) {
    case "GOZG": return require('../assets/images/gold.png');
    case "GOZS": return require('../assets/images/silver.png');
    case "GOZP": return require('../assets/images/plat.png');
    case "GOZB": return require('../assets/images/good.png');

  }
}

const getCourseByDef = (def : string) => {
  switch(def) {
    case "GOZG": return 102474.5;
    case "GOZS": return 1267;
    case "GOZP": return 59833.3;
    case "GOZB": return 25834;

  }
}

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    SecureStore.getItemAsync('token').then(token => {
      userInfo(token).then((resp) => {
        setUserInfo(resp.data);
      }).catch((x) => {
        console.log(x);
      });
      getCurrencies(token).then((resp) => {
        console.log(resp);
        console.log(resp.data);
        console.log(resp.data.metal_currencies);
        setCurrencies(resp.data.metal_currencies);
        setRefreshing(false)
      }).catch((x) => {
        console.log(x);
        setRefreshing(false)
      });
    });
  }, []);

  const [user, setUserInfo] = useState({name: "Пользователь", email: "a@b", rub_account: 0})
  const [currencies, setCurrencies] = useState([])
  const [replenishModalOpen, setReplenishModalOpen] = useState(false)
  const [buyAmount, setBuyAmount] = useState(100)

  if (user.name == "Пользователь") {
    SecureStore.getItemAsync('token').then(token => {
      userInfo(token).then((resp) => {
        setUserInfo(resp.data);
      }).catch((x) => {
        console.log(x);
      });
      getCurrencies(token).then((resp) => {
        console.log(resp);
        console.log(resp.data);
        console.log(resp.data.metal_currencies);
        setCurrencies(resp.data.metal_currencies);
      }).catch((x) => {
        console.log(x);
      });;
    });
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        >
          <Text style={styles.title}>Баланс</Text>
      <Text style={styles.balanceNumber}>{user.rub_account} ₽</Text>
      <View style={styles.replenishContainer}>
        <Image source={require('../assets/images/replenish.png')}
          style={{
            width: 32,
            height: 25,
            resizeMode: 'contain',
            marginLeft: "7%",
            marginTop: 10,
            marginRight: "2%"
          }}
        />
        <Pressable>
          <Text
          onPress={() => setReplenishModalOpen(true)}
          style={styles.replenishText}>Пополнить</Text>
        </Pressable>
        <Image source={require('../assets/images/withdraw.png')}
          style={{
            width: 32,
            height: 25,
            resizeMode: 'contain',
            marginTop: 10,
            marginLeft: "12%",
            marginRight: "2%"
          }}
        />
        <Text style={styles.replenishText}>Вывести</Text>
      </View>
      <Text style={styles.title}>Портфель</Text>
      {currencies.map((x : any) => {
        var m = new GoodModel(x.currency, 1, 997, x.currency, x.amount, "+500.2 ₽, +23% за всё время");
        m.course = getCourseByDef( x.currency);
        return <MetalCard navigation={navigation} source={getIconByDef(x.currency)} model={m}/>
      })}
        </ScrollView>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={replenishModalOpen}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={{
                position: 'absolute',
                marginTop: 10,
              }}
              onPress={() => setReplenishModalOpen(!replenishModalOpen)}
            >
              <Image style={{
                width: 20,
                marginLeft: "100%",
                height: 20,
                  resizeMode: 'contain'
                }} source={require('../assets/images/cross.png')}/>
            </Pressable>
            <Text style={styles.modalText}>Пополнить</Text>
            <Text style={styles.sellAcceptanceModalText}>Сумма пополнения:</Text>
            <View style={styles.SectionStyle}>
              <TextInput
                  defaultValue="100"
                  style={styles.inputStyle}
                  onChangeText={(amount) =>
                    setBuyAmount(Number(amount))
                  }
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  keyboardType='numeric'
                  returnKeyType="default"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
            </View>
            <Text style={styles.sellAcceptanceModalText}>Выберите способ пополнения баланса</Text>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Pressable
                onPress={() => SecureStore.getItemAsync('token').then(token => {
                  replenish(buyAmount, token).then((resp) => {
                    SecureStore.getItemAsync('token').then(token => {
                      userInfo(token).then((resp) => {
                        setUserInfo(resp.data);
                      }).catch((x) => {
                        console.log(x);
                      });
                    });
                  }).catch((x) => {
                    console.log(x);
                  });
                  setReplenishModalOpen(!replenishModalOpen)
                })}
              >
              <Image style={{
                width: 130,
                height: 90,
                marginRight: 5,
                  resizeMode: 'contain'
                }} source={require('../assets/images/MNP.png')}/>
              </Pressable>
              <Pressable
                onPress={() => SecureStore.getItemAsync('token').then(token => {
                  replenish(buyAmount, token).then((resp) => {
                    SecureStore.getItemAsync('token').then(token => {
                      userInfo(token).then((resp) => {
                        setUserInfo(resp.data);
                      }).catch((x) => {
                        console.log(x);
                      });
                    });
                  }).catch((x) => {
                    console.log(x);
                  });
                  setReplenishModalOpen(!replenishModalOpen)
                })}
              >
              <Image style={{
                width: 130,
                height: 90,
                  resizeMode: 'contain'
                }} source={require('../assets/images/sbp.png')}/>
                </Pressable>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              
            <Pressable
                onPress={() => SecureStore.getItemAsync('token').then(token => {
                  replenish(buyAmount, token).then((resp) => {
                    SecureStore.getItemAsync('token').then(token => {
                      userInfo(token).then((resp) => {
                        setUserInfo(resp.data);
                      }).catch((x) => {
                        console.log(x);
                      });
                    });
                  }).catch((x) => {
                    console.log(x);
                  });
                  setReplenishModalOpen(!replenishModalOpen)
                })}
              >
              <Image style={{
                width: 130,
                height: 90,
                marginRight: 5,
                  resizeMode: 'contain'
                }} source={require('../assets/images/tincoff.png')}/>
              </Pressable>
              
              <Pressable
                onPress={() => SecureStore.getItemAsync('token').then(token => {
                  replenish(buyAmount, token).then((resp) => {
                    SecureStore.getItemAsync('token').then(token => {
                      userInfo(token).then((resp) => {
                        setUserInfo(resp.data);
                      }).catch((x) => {
                        console.log(x);
                      });
                    });
                  }).catch((x) => {
                    console.log(x);
                  });
                  setReplenishModalOpen(!replenishModalOpen)
                })}
              >
              <Image style={{
                width: 130,
                height: 90,
                  resizeMode: 'contain'
                }} source={require('../assets/images/YandexPay.png')}/>
              </Pressable>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              
              <Pressable
                onPress={() => SecureStore.getItemAsync('token').then(token => {
                  replenish(buyAmount, token).then((resp) => {
                    SecureStore.getItemAsync('token').then(token => {
                      userInfo(token).then((resp) => {
                        setUserInfo(resp.data);
                      }).catch((x) => {
                        console.log(x);
                      });
                    });
                  }).catch((x) => {
                    console.log(x);
                  });
                  setReplenishModalOpen(!replenishModalOpen)
                })}
              >
              <Image style={{
                width: 130,
                height: 90,
                marginRight: 5,
                  resizeMode: 'contain'
                }} source={require('../assets/images/Qiwi.png')}/>
              </Pressable>
              
              <Pressable
                onPress={() => SecureStore.getItemAsync('token').then(token => {
                  replenish(buyAmount, token).then((resp) => {
                    SecureStore.getItemAsync('token').then(token => {
                      userInfo(token).then((resp) => {
                        setUserInfo(resp.data);
                      }).catch((x) => {
                        console.log(x);
                      });
                    });
                  }).catch((x) => {
                    console.log(x);
                  });
                  setReplenishModalOpen(!replenishModalOpen)
                })}
              >
              <Image style={{
                width: 130,
                height: 90,
                  resizeMode: 'contain'
                }} source={require('../assets/images/sber.png')}/>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* <MetalCard navigation={navigation} source={require('../assets/images/gold.png')} model={new GoodModel("Goznak Gold Token", 1, 997, "GGT", 3.2, "+500.2 ₽, +23% за всё время")}/>
      <MetalCard navigation={navigation} source={require('../assets/images/silver.png')} model={new GoodModel("Goznak Silver Token", 1, 888.9, "GST", 1.5, "+276.8 ₽, +23% за всё время")}/>
      <MetalCard navigation={navigation} source={require('../assets/images/plat.png')} model={new GoodModel("Goznak Platinum Token", 1, 761, "GPT", 6.7, "+597.6 ₽, +23% за всё время")}/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  title: {
    fontSize: 32,
    color: '#214F48',
    fontWeight: 'bold',
    margin: "5%"
  },
  balanceNumber: {
    fontSize: 32,
    color: '#000000',
    fontWeight: 'bold',
    marginLeft: "7%"
  },
  replenishContainer: {
    flexDirection: 'row'
  },
  replenishText: {
    fontSize: 16,
    color: '#214F48',
    fontWeight: 'bold',
    marginTop: 10
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonTextStyle: {
    padding: 15,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    color: '#214F48'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 700,
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 11,
    width: 200,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#005F50",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    margin: "10%",
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 39,
    color: '#214F48'
  },
  sellAcceptanceModalText: {
    marginBottom: "5%",
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 18,
    color: '#898A8D'
  },
  sellAcceptanceBalanceModalText: {
    marginBottom: "10%",
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 39,
    color: '#09B99D'
  },
  inputStyle: {
    marginBottom: "10%",
    width: 200,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 32,
    lineHeight: 39,
    textAlign: "center",
    borderColor: '#dadae8',
  },
  SectionStyle: {
    height: 70,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buySellButtonStyle: {
    marginBottom: "10%",
    width: 200,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 16,
    lineHeight: 39,
    textAlign: "center",
    borderColor: '#dadae8',
    backgroundColor: '#005F50',
    
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
