import React, { Component } from 'react';
import CameraView from './Components/Camera'
import HistoryView from './Components/History'
import { TabView, SceneMap } from 'react-native-tab-view';

export default class App extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Scan' },
      { key: 'second', title: 'History' },
    ],
  };

  render() {
    return (
      <TabView
        tabBarPosition={'bottom'}
        navigationState={this.state}
        renderScene={SceneMap({
          first: CameraView,
          second: HistoryView,
        })}
        onIndexChange={index => {
          console.log('Change route to ' + index);
          this.setState({ index });
        }}
      />
    );
  }
}
