import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { Col, Row } from 'antd';
import ParticleBG from '../particle_bg/ParticleBG';
import { useEffect, useState } from 'react';
import { useMicVAD } from "@ricky0123/vad-react"
import { socket } from '../socket';

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

// const heroImage = 'landing_hero.png'

const contentStyle = {
    textAlign: 'left',
    // minHeight: 768,
    lineHeight: '120px',
    // padding: '220px 50px 220px 120px',
    padding: '100px',
    // fontSize: '200px',
  };

// const imageStyle = {
//     marginTop: '120px',
// }

const rowStyle = {
    textAlign: 'center',
    verticalAlign: 'center',
    maxheight: '100vh',
}

function TranscriptsBody() {
    const vad = useMicVAD({
        startOnLoad: false,
        redemptionFrames: 2,
        onSpeechEnd: (audio) => {
            console.log("User stopped talking")
            let audio1 = JSON.stringify(audio);
            socket.emit('audio', audio1);
        },
        })
    const [transcripts, setTranscripts] = useState('');
    const [minutes, setMinutes] = useState('');

    let startRecording = () => {
        vad.start();
    }

    let stopRecording = () => {
        vad.pause();
    }

    // let generateMinutes = () => {
    //     socket.emit('mom', 'transcripts');
    // }

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
            setTranscripts(previous => [...previous, value]);
        }

        function onMinutes(value) {
            console.log(value);
            setMinutes(value);
        }
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('transcript', onTranscript);
        // socket.on('minutes', onMinutes);
    
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('transcript', onTranscript);
        };
        }, []);

    return (
    <Row style={rowStyle}>
        <ParticleBG />
        <Col span={24}>
            <Content style={contentStyle}>
                { !vad.listening && 
                <>
                    <Button type="primary" onClick={startRecording} htmlType="button">
                        Click here to start recording...
                    </Button>

                    {/* <Button type="primary" onClick={generateMinutes} htmlType="button">
                    Generate Minutes
                    </Button> */}
                </>
                }
                { vad.listening && 
                <>
                    <Button type="primary" onClick={stopRecording} htmlType="button">
                        Click here to stop recording...
                    </Button>
                    <Typography>
                        <Title>Transcripts</Title>
                        <Paragraph style={{fontSize: '20px'}}>
                        {transcripts}
                        </Paragraph>
                    </Typography>
                </>
                }
                { minutes &&
                    <Typography>
                        <Title>Minutes</Title>
                        <Paragraph style={{fontSize: '20px'}}>
                        {minutes}
                        </Paragraph>
                    </Typography>
                }
            </Content>
        </Col>
        
        <Col span={24} style={{position: 'fixed', bottom: 0, width:"100%"}}>
            <Footer style={{ textAlign: 'center', background: 'transparent' }}>Copyright © Easyminutes, 2024. All rights reserved.</Footer>
        </Col>
    </Row>
    )
}
  
export default TranscriptsBody;