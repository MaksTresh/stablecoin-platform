import { Text, RefreshControl, View, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/prof.png')}
          style={{
            marginTop: "5%",
            width: "100%",
            height: "100%",
            resizeMode: 'contain'
          }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
