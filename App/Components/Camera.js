import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Modal from 'react-native-modal';
import moment from 'moment';
import { Codes } from '../database';
import styles from '../Style'
import { copyToClipboard } from '../Util';

export default class CameraView extends PureComponent {
  state = {
    isModalVisible: false,
    data: '',
    rawData: '',
    type: '',
    time: ''
  };

  _closeModal = () =>
    this.setState({ isModalVisible: false });

  _openModal = ({ data, rawData, type }) => {
    if (this.state.isModalVisible) return
    console.log('CameraView._openModal');
    let time = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    this.setState({ isModalVisible: true, data: data, rawData: rawData, type: type, time: time },
      () => {
        Codes.insert({
          time: time,
          data: data,
          type: type
        }, save = true)
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.cameraOn && <RNCamera
          ref={ref => { this.camera = ref }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onBarCodeRead={this._openModal}>
          <View style={localStyles.rectangleContainer}>
            <View style={localStyles.rectangle} />
          </View>
        </RNCamera>}
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
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
})
