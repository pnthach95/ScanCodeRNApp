import React, { Component } from 'react';
import CameraView from './Components/Camera'
import HistoryView from './Components/History'
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class App extends Component {
  render() {
    return (
      <ScrollableTabView locked
        onChangeTab={() => { }}
        tabBarPosition={'bottom'}>
        <CameraView tabLabel={'Scan'} />
        <HistoryView tabLabel={'History'} />
      </ScrollableTabView>
    );
  }
}
