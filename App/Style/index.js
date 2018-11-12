import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  containerWhite: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    width: 100,
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 15
  },
  whiteText: {
    color: 'white'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
