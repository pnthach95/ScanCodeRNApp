import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import InsideModal from './InsideModal';
import { Codes } from '../database';
import styles from '../Style';
import { copyToClipboard, timeFormat } from '../Util';

const flashOff = RNCamera.Constants.FlashMode.off;
const flashOn = RNCamera.Constants.FlashMode.torch;

export default class CameraView extends PureComponent {
  state = {
    flash: flashOff,
    isModalVisible: false,
    data: '',
    rawData: '',
    type: '',
    time: ''
  };

  _closeModal = () => this.setState({ isModalVisible: false });

  _openModal = ({ data, rawData, type }) => {
    if (this.state.isModalVisible) return;
    console.log('CameraView._openModal');
    let time = moment().format(timeFormat);
    this.setState({ isModalVisible: true, data: data, rawData: rawData, type: type, time: time },
      () => {
        Codes.insert({
          time: time,
          data: data,
          type: type
        }, save = true)
      });
  }

  _toggleFlash = () => {
    if (this.state.flash === flashOff)
      this.setState({ flash: flashOn });
    else
      this.setState({ flash: flashOff });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.cameraOn && <RNCamera
          ref={ref => { this.camera = ref }}
          style={styles.preview}
          flashMode={this.state.flash}
          type={RNCamera.Constants.Type.back}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onBarCodeRead={this._openModal}>
          <View style={localStyles.rectangleContainer}>
            <View style={localStyles.rectangle} />
          </View>
        </RNCamera>}
        <Icon name={this.state.flash == flashOff ? 'ios-flash-off' : 'ios-flash'}
          size={55} color={'white'} onPress={this._toggleFlash}
          style={localStyles.flash} />
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
    borderColor: '#0F0',
    backgroundColor: 'transparent',
  },
  flash: {
    position: 'absolute',
    bottom: 10,
    justifyContent: 'center'
  }
});
