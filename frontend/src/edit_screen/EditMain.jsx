import 'antd/dist/reset.css';
import { Col, Row, ConfigProvider, message, Layout } from 'antd';
import ParticleBG from '../particle_bg/ParticleBG';
import SideBar from './SideBar/SideBar';
import InsideHeader from '../landing_header/InsideHeader';
import MainImage from './image/MainImage';
import UploadButton from './UploadButton';
import React, { Component } from 'react';
import ApiServiceHelper from '../helpers/ApiServiceHelper';
import UploadModal from '../modals/UploadModal';
import ApiService from '../helpers/ApiService';
import EditSlider from './EditSlider';
import ChooseModal from '../modals/ChooseModal';
import ProfileModal from '../modals/ProfileModal';
import { Navigate  } from "react-router-dom";


const { Header, Content, Footer, Sider } = Layout;

const rowStyle = {
    textAlign: 'center',
    verticalAlign: 'center',
    width: '100%',
}

const config= {
    token: {
        // colorPrimary: '#0E8388',
        // colorBgBase: '#2C3333',
        // colorText: '#CBE4DE',
        // colorBorder: '#CBE4DE',
        // colorIcon: '#CBE4DE',
        // colorBgSpotlight: '#2C3333'

        colorPrimary: '#ECE8DD',
    colorBgBase: '#579BB1',
    colorText: '#F8F4EA',
    colorBorder: '#F8F4EA',
    colorIcon: '#F8F4EA',
    },
};

const imageStyle = {
    width: "90vw",
    height: "100%",
}

class EditMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: null,
            backgroundImageUrl: null,
            jwtToken: null,
            is_updated: true,
            upload_modal_open: false,
            choose_modal_open: false,
            profile_modal_open: false,
            show_slider: false,
            slider_action: null,
            contentHeight: 'auto',
            spinning: false,
            // jwtToken: localStorage.getItem('jwtToken')
        };

        // console.log(localStorage.getItem('jwtToken'))
    }

    updateLocalStorage() {
        localStorage.setItem('jwtToken', this.state.jwtToken);
        localStorage.setItem('imageUrl', this.state.imageUrl);
    }

    updateUploadModal(flag) {
        this.setState({upload_modal_open: flag});
    }

    updateChooseModal(flag) {
        this.setState({choose_modal_open: flag});
    }

    updateProfileModal(flag) {
        this.setState({profile_modal_open: flag});
    }

    updateSliderAction(action, flag=true) {
        this.setState({slider_action: action, show_slider: flag});
    }

    updateSpinFlag(flag) {
        this.setState({ 'spinning': flag})
    }

    setImageUrl = async (imageUrl, background = false) => {
        this.updateSpinFlag(true)
        const base64_image = await ApiServiceHelper.blobToBase64(imageUrl)
        const data = {
            image: base64_image
        }
        const header = {
            jwt_token: this.state.jwtToken
        }
        const response = await ApiServiceHelper.post('image/upload', data, header);
        this.updateSpinFlag(false)
        if(background){
            this.updateBackgroundImageToState(response.url)
        } else {
            this.updateImageToState(response.url);
        }
        
        message.success(`file uploaded successfully`);
    };

    updateImageToState = (imageUrl) => {
        this.setState({ imageUrl: imageUrl, is_updated:  Math.random() }, this.updateLocalStorage.bind(this));
    }

    updateBackgroundImageToState = async (imageUrl) => {
        this.setState({ backgroundImageUrl: imageUrl }, async function() {
            const data = {
                ...this.state,
                updateSpinFlag: this.updateSpinFlag.bind(this)
            }
            imageUrl = await ApiService.replaceBackground(data)
            this.updateImageToState(imageUrl)
        });
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.imageUrl == null && prevState.jwtToken == null) {
            return {
                'jwtToken': localStorage.getItem('jwtToken'),
                'imageUrl': localStorage.getItem('imageUrl') 
            };
        }
        return null;
    }

    handleResize = () => {
        const windowHeight = window.innerHeight;
        const content = document.getElementById('content');
        let contentHeight = null;
        if(content) {
            contentHeight = content.clientHeight;
        }
    
        if (contentHeight < windowHeight) {
          this.setState({ contentHeight: `calc(100vh - 156px)` });
        } else {
          this.setState({ contentHeight: 'auto' });
        }
    };

    render() {
        if (!this.state.jwtToken) {
            // Redirect to a different URL if the token is not present
            return <Navigate to="/" />;
        }

        return (
            <ConfigProvider 
                theme={config}
            >
                <ParticleBG />
                <UploadModal 
                    upload_modal_open={this.state.upload_modal_open} 
                    title="Upload Background" 
                    updateUploadModal={this.updateUploadModal.bind(this)} 
                    setImageUrl={this.setImageUrl.bind(this)} 
                    updateSpinFlag={this.updateSpinFlag.bind(this)}
                />
                <ChooseModal 
                    choose_modal_open={this.state.choose_modal_open} 
                    jwtToken={this.state.jwtToken} 
                    title="Choose Image" 
                    updateChooseModal={this.updateChooseModal.bind(this)} 
                    updateImageToState={this.updateImageToState.bind(this)} 
                />
                <ProfileModal 
                    profile_modal_open={this.state.profile_modal_open} 
                    jwtToken={this.state.jwtToken} 
                    title="Update Profile" 
                    updateProfileModal={this.updateProfileModal.bind(this)} 
                />
                
                <InsideHeader updateProfileModal={this.updateProfileModal.bind(this)} />
                <Row id="content" style={{ minHeight: this.state.contentHeight, 
                                position: 'relative',
                                textAlign: 'center',
                                verticalAlign: 'center',
                                width: '100%', }}>
                    <Col span={6}>
                        <SideBar 
                            jwtToken={this.state.jwtToken} 
                            imageUrl={this.state.imageUrl} 
                            backgroundImageUrl={this.state.backgroundImageUrl} 
                            updateImageToState={this.updateImageToState.bind(this)}
                            updateUploadModal={this.updateUploadModal.bind(this)} 
                            updateChooseModal={this.updateChooseModal.bind(this)} 
                            updateSliderAction={this.updateSliderAction.bind(this)}
                            updateSpinFlag={this.updateSpinFlag.bind(this)}/>
                    </Col>
                    <Col span={18} style={imageStyle}>
                        {/* <EditSlider 
                            show_slider={this.state.show_slider} 
                            slider_action={this.state.slider_action}
                            jwtToken={this.state.jwtToken} 
                            imageUrl={this.state.imageUrl}
                            updateImageToState={this.updateImageToState.bind(this)}
                        /> */}

                        { this.state.imageUrl &&
                            <EditSlider 
                                show_slider={this.state.show_slider} 
                                slider_action={this.state.slider_action}
                                jwtToken={this.state.jwtToken} 
                                imageUrl={this.state.imageUrl}
                                updateImageToState={this.updateImageToState.bind(this)}
                                updateSpinFlag={this.updateSpinFlag.bind(this)}
                            />
                        }
                        {this.state.imageUrl ? (
                            <MainImage 
                                imageUrl={this.state.imageUrl} 
                                is_updated={this.state.is_updated}
                                spinning={this.state.spinning}/>
                        ) : (
                            <UploadButton 
                                setImageUrl={this.setImageUrl.bind(this)}
                            />
                        )}
                    </Col>
                </Row>
                <Footer className="sticky-footer" style={{ textAlign: 'center' }}>Copyright © Illustrix, 2023. All rights reserved.</Footer>
            </ConfigProvider>
        );
    }
}

export default EditMain;
