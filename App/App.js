import React, { Component } from 'react';
import CameraView from './Components/Camera'
import HistoryView from './Components/History'
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cameraOn: true
    }
  }

  _onChangeTab = (index) => {
    if (index.i == 0) {
      this.setState({ cameraOn: true })
    }
    else {
      this.setState({ cameraOn: false })
    }
  }

  render() {
    return (
      <ScrollableTabView locked
        onChangeTab={this._onChangeTab}
        tabBarUnderlineStyle={{ backgroundColor: 'white' }}
        tabBarBackgroundColor={this.state.cameraOn ? 'green' : 'blue'}
        tabBarActiveTextColor={'white'}
        tabBarInactiveTextColor={'#fff9'}
        tabBarPosition={'bottom'}>
        <CameraView tabLabel={'Scan'} cameraOn={this.state.cameraOn} />
        <HistoryView tabLabel={'History'} />
      </ScrollableTabView>
    );
  }
}
