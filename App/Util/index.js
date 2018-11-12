import { Clipboard } from 'react-native';
import Toast from 'react-native-root-toast';

export const copyToClipboard = (data) => () => {
  console.log('copyToClipboard');
  Clipboard.setString(data);
  let toast = Toast.show('Copied to Clipboard', {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
}
