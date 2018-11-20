import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Swipeable from 'react-native-swipeable';
import { Queryable } from 'vasern';

import InsideModal from './InsideModal';
import { Codes } from '../database';
import styles from '../Style';
import { copyToClipboard, timeFormat } from '../Util';
import moment from 'moment';

export default class HistoryView extends PureComponent {
  state = {
    list: [],
    isModalVisible: false,
    data: '',
    type: '',
    time: '',
    deleteItem: {
      index: -1,
      item: {}
    },
    hitUndo: false,
    showUndo: false
  };

  undoItem = {}
  undoList = []

  componentDidMount() {
    Codes.onLoaded(() => {
      let data = Codes.data();
      data = data.sort((a, b) => moment(a.time, timeFormat).isBefore(moment(b.time, timeFormat)));
      this.setState({ list: data });
    });
    Codes.onInsert(({ changed }) => {
      if (this.state.hitUndo) {
        this.setState({ hitUndo: false });
      } else {
        this.setState({ list: [changed[0], ...this.state.list] });
      }
    });
  }

  _closeModal = () => this.setState({ isModalVisible: false });

  _openModal = ({ data, type, time }) => () => {
    this.setState({ isModalVisible: true, data: data, type: type, time: time });
  }

  _removeAll = () => {
    Codes.perform(function (db) {
      Codes.data().forEach(function (item) {
        db.remove(item);
      })
    });
    this.setState({ list: [] });
  }

  _askRemoveAll = () => {
    Alert.alert('Remove all code?', '', [
      { text: 'Cancel', onPress: () => { }, style: 'cancel' },
      { text: 'OK', onPress: this._removeAll }]);
  }

  _keyExtractor = (item, index) => `code ${index}`

  _removeItem = (item) => () => {
    Codes.remove(item.id);
    this.undoList = [...this.state.list];
    this.undoItem = item;
    let data = this.state.list.filter((value, index) => value.id != item.id);
    this.setState({ list: data, showUndo: true });
  }

  _onUndoItem = () => {
    this.setState({ list: this.undoList, hitUndo: true, showUndo: false });
    let obj = Codes.get({ time: this.undoItem.time })
    if (obj === undefined) {
      Codes.insert({
        time: this.undoItem.time,
        data: this.undoItem.data,
        type: this.undoItem.type
      }, save = true)
    }
  }

  rightButtons = <View style={localStyles.delete}>
    <Text style={styles.whiteText}>Delete</Text>
  </View>

  _renderItem = ({ item }) =>
    <Swipeable rightContent={this.rightButtons}
      onRightActionRelease={this._removeItem(item)}>
      <TouchableOpacity onPress={this._openModal(item)}>
        <View style={localStyles.item}>
          <Text>Date: {item.time}</Text>
          <Text>Type: {item.type}</Text>
          <View style={localStyles.indicator} />
          <Text numberOfLines={2}
            style={localStyles.dataText}>{item.data}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>

  render() {
    return (
      <View style={styles.containerWhite}>
        {this.state.list.length == 0 ?
          <View style={[styles.containerWhite, styles.center]}>
            <Text>No data</Text>
          </View> :
          <FlatList
            data={this.state.list}
            initialNumToRender={8}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem} />}

        <View style={localStyles.footer}>
          {this.state.showUndo &&
            <TouchableOpacity onPress={this._onUndoItem}
              style={[localStyles.undo, styles.center]}>
              <Text style={styles.whiteText}>Undo</Text>
            </TouchableOpacity>}
          {this.state.list.length != 0 &&
            <TouchableOpacity onPress={this._askRemoveAll}
              style={[localStyles.removeAll, styles.center]}>
              <Text style={styles.whiteText}>Clean History</Text>
            </TouchableOpacity>}
        </View>

        <Modal isVisible={this.state.isModalVisible}
          onBackButtonPress={this._closeModal} >
          <View style={styles.modalContent}>
            <InsideModal time={this.state.time} type={this.state.type} data={this.state.data} />
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
    backgroundColor: 'white',
    borderBottomColor: '#666',
    borderTopColor: '#666',
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  removeAll: {
    backgroundColor: 'red',
    padding: 10
  },
  undo: {
    backgroundColor: 'green',
    padding: 10,
    marginBottom: 10
  },
  footer: {
    backgroundColor: 'white',
    padding: 5
  },
  delete: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  dataText: {
    fontSize: 18
  },
  indicator: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
    alignSelf: 'center',
    margin: 4,
  }
})
