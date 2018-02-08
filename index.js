import { AppRegistry } from 'react-native';
import App from './App';

import codePush from "react-native-code-push";

AppRegistry.registerComponent('codePushIntergradation', () => codePush(App));
