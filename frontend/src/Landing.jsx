import 'antd/dist/reset.css';
import { Layout, Space, ConfigProvider } from 'antd';
import LandingHeader from './landing_header/LandingHeader';
import LandingMain from './landing_main/LandingMain';
import { useEffect } from 'react';
import { useMicVAD } from "@ricky0123/vad-react"
import { socket } from './socket';

const config= {
  token: {
    // colorPrimary: '#0E8388',
    // colorBgBase: '#2C3333',
    // colorText: '#CBE4DE',
    // colorBorder: '#CBE4DE',
    // colorIcon: '#CBE4DE',
    
    colorPrimary: '#205295',
    colorBgBase: '#0A2647',
    colorText: '#FFFFFF',
    colorBorder: '#FFFFFF',
    colorIcon: '#FFFFFF',
  },
};

const layoutStyel = {
  background: 'transparent',
  height: '100vh',
}



function Landing() {
  const vad = useMicVAD({
    startOnLoad: true,
    onSpeechEnd: (audio) => {
      console.log("User stopped talking")
      let audio1 = JSON.stringify(audio);
      socket.emit('audio', audio1);
    },
  })

  useEffect(() => {
    function onConnect() {
      console.log('Connected to server');
    }

    function onDisconnect() {
      console.log('Disconnected from server');
    }

    function onTranscript(value) {
      // setFooEvents(previous => [...previous, value]);
      console.log(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('transcript', onTranscript);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('transcript', onTranscript);
    };
  }, []);
  
  // return (<div>{vad.userSpeaking && "User is speaking"}</div>)
  
  return (
    <ConfigProvider 
    theme={config}
    >
      <Space direction="vertical" style={{ width: '100%', height: '100%' }} size={[0, 48]}>
        <Layout style={layoutStyel}>
          <LandingHeader ></LandingHeader>
          <LandingMain></LandingMain>
        </Layout>
      </Space>
    </ConfigProvider>
    
    
  );
}

export default Landing;
