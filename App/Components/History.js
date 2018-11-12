import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Swipeable from 'react-native-swipeable';

import { Codes } from '../database';
import styles from '../Style';
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
    Codes.onLoaded(() => {
      let data = Codes.data();
      this.setState({ list: data });
    });
    Codes.onInsert(({ changed }) => {
      this.setState({ list: [...this.state.list, changed[0]] });
      console.log('HistoryView.onInsert', changed);
    });
    Codes.onRemove(({ changed }) => {
      let data = this.state.list.filter((value, index) => value.id != changed.id)
      this.setState({ list: data })
    });
  }

  _closeModal = () => this.setState({ isModalVisible: false });

  _openModal = ({ data, type, time }) => () => {
    console.log('HistoryView._openModal');
    this.setState({ isModalVisible: true, data: data, type: type, time: time });
  }

  _removeAll = () => {
    Codes.perform(function (db) {
      Codes.data().forEach(function (item) {
        db.remove(item)
      })
    });
    this.setState({ list: [] });
  }

  _keyExtractor = (item, index) => `code ${index}`

  _removeItem = (item) => () => Codes.remove(item.id)

  rightButtons = <View style={localStyles.delete}>
    <Text style={styles.whiteText}>Delete</Text>
  </View>

  _renderItem = ({ item }) =>
    <Swipeable rightContent={this.rightButtons}
      onRightActionRelease={this._removeItem(item)}>
      <TouchableOpacity onPress={this._openModal(item)}>
        <View style={localStyles.item}>
          <Text>Date: {item.time}</Text>
          <Text>{item.data}</Text>
          <Text>Type: {item.type}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>

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
  },
  delete: {
    padding: 10,
    marginVertical: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'red'
  }
})
