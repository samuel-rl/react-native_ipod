import React from 'react';
import {StatusBar} from 'react-native';
import IpodView from './components/IpodView';

declare const global: {HermesInternal: null | {}};

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <IpodView />
    </>
  );
};

export default App;
