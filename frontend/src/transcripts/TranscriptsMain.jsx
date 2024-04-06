import 'antd/dist/reset.css';
import { Layout, Space, ConfigProvider } from 'antd';
import LandingHeader from '../landing_header/LandingHeader';
import TranscriptsBody from './TranscriptsBody';


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



function TranscriptsMain() {
  
  
  // return (<div>{vad.userSpeaking && "User is speaking"}</div>)
  
  return (
    <ConfigProvider 
    theme={config}
    >
      <Space direction="vertical" style={{ width: '100%', height: '100%' }} size={[0, 48]}>
        <Layout style={layoutStyel}>
          <LandingHeader ></LandingHeader>
          <TranscriptsBody></TranscriptsBody>
        </Layout>
      </Space>
    </ConfigProvider>
    
    
  );
}

export default TranscriptsMain;