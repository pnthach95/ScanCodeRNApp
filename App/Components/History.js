import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { Codes } from '../database';
import styles from '../Style'
import { copyToClipboard } from '../Util';

export default class HistoryView extends PureComponent {
  state = {
    list: [],
    isModalVisible: false,
    data: '',
    type: '',
    time: ''
  };

  componentDidMount() {
    let data = Codes.data()
    let con = JSON.stringify(data)
    this.setState({ list: data })
    console.log('HistoryView.componentDidMount', con);
    Codes.onInsert(({ changed }) => {
      this.setState({ list: [...this.state.list, changed[0]] })
      console.log('HistoryView.onInsert', changed);
    })
  }

  _closeModal = () =>
    this.setState({ isModalVisible: false });

  _openModal = ({ data, type, time }) => () => {
    console.log('HistoryView._openModal');
    this.setState({ isModalVisible: true, data: data, type: type, time: time });
  }

  _removeAll = () => {
    this.state.list.forEach(element => {
      Codes.remove(element.id);
    });
    this.setState({ list: [] });
  }

  _keyExtractor = (item, index) => `code ${index}`

  _renderItem = ({ item }) => <TouchableOpacity onPress={this._openModal(item)}>
    <View style={localStyles.item}>
      <Text>Date: {item.time}</Text>
      <Text>{item.data}</Text>
      <Text>Type: {item.type}</Text>
    </View>
  </TouchableOpacity>

  render() {
    if (this.state.list.length == 0)
      return (
        <View style={[styles.containerWhite, styles.center]}>
          <Text>No data</Text>
        </View>
      );

    return (
      <View style={styles.containerWhite}>
        <FlatList
          data={this.state.list}
          initialNumToRender={8}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem} />
        <View style={localStyles.footer}>
          <TouchableOpacity onPress={this._removeAll}
            style={[localStyles.removeAll, styles.center]}>
            <Text style={styles.whiteText}>Clean History</Text>
          </TouchableOpacity>
        </View>

        <Modal isVisible={this.state.isModalVisible}
          onBackButtonPress={this._closeModal} >
          <View style={styles.modalContent}>
            <Text>Date: {this.state.time}</Text>
            <Text>Data: {this.state.data}</Text>
            <Text>Type: {this.state.type}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={this._closeModal}
                style={styles.button}>
                <Text style={styles.whiteText}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={copyToClipboard(this.state.data)}
                style={styles.button}>
                <Text style={styles.whiteText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  item: {
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  removeAll: {
    backgroundColor: 'red',
    padding: 10
  },
  footer: {
    backgroundColor: 'white',
    padding: 5
  }
})