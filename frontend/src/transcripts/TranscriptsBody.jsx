import React from 'react';
import { Layout, Typography, Button, message } from 'antd';
import { Col, Row } from 'antd';
import ParticleBG from '../particle_bg/ParticleBG';
import { useEffect, useState } from 'react';
import { useMicVAD } from "@ricky0123/vad-react"
import { socket } from '../socket';
import { Spin } from 'antd';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

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

function TranscriptsBody(props) {
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
    const [spinning, setSpinning] = useState(false);
    const [email, setEmail] = useState(localStorage.getItem('email'));

    let startRecording = () => {
        socket.connect();
        vad.start();
    }

    let stopRecording = () => {
        vad.pause();
        // socket.disconnect();
    }

    let generateMinutes = () => {
        socket.connect();
        console.log(email);
        socket.emit('mom', email);
        setSpinning(true);
    }

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
            setSpinning(false);
            message.success('Minutes of the meeting generated successfully! An email containing the minutes has been dispatched.');
        }
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('transcript', onTranscript);
        socket.on('minutes', onMinutes);
    
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('transcript', onTranscript);
        };
        }, []);

    return (
    <Row style={rowStyle}>
        <ParticleBG />
        <Col span={24} style={{marginBottom:'64px'}}>
        <Spin tip="Generating..." spinning={spinning} fullscreen>
            <Content style={contentStyle}>
                { !vad.listening && 
                <>
                    <Button type="primary" onClick={startRecording} htmlType="button">
                        Start recording
                    </Button>
                </>
                }
                { vad.listening && 
                <>
                    <Button type="primary" onClick={stopRecording} htmlType="button" danger>
                       Stop recording.
                    </Button>
                </>
                }
                {
                    <Button style={{marginLeft: "10px"}} type="primary" onClick={generateMinutes} htmlType="button">
                    Generate Minutes
                    </Button>
                }
                { transcripts &&
                    <Typography>
                        <Title>Transcripts</Title>
                        <Paragraph style={{fontSize: '20px'}}>
                        {transcripts}
                        </Paragraph>
                    </Typography>
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
        </Spin>
        </Col>
        <Col span={24} style={{position: 'fixed', bottom: 0, width:"100%"}}>
            <Footer style={{ textAlign: 'center', background: 'transparent' }}>Copyright © Easyminutes, 2024. All rights reserved.</Footer>
        </Col>
    </Row>
    )
}
  
export default TranscriptsBody;