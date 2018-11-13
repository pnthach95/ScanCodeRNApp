import React, { PureComponent } from 'react';
import { Text, View, ScrollView, StyleSheet, Dimensions } from 'react-native';

export default class InsideModal extends PureComponent {
  render() {
    return (
      <View>
        <Text>Date: {this.props.time}</Text>
        <Text>Type: {this.props.type}</Text>
        <ScrollView style={localStyles.scrollView}>
          <Text style={localStyles.data}>{this.props.data}</Text>
        </ScrollView>
      </View>
    )
  }
}

const localStyles = StyleSheet.create({
  data: {
    fontSize: 18,
  },
  scrollView: {
    maxHeight: Dimensions.get('screen').height / 3,
    marginVertical: 4,
  }
});
