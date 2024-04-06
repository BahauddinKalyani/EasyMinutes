import { Layout, Button } from 'antd';

const { Header } = Layout;

const headerStyle = {
    background: 'transparent',
}

const buttonStyle = {
    margin: '30px 15px',
    float: 'right',
}

const imageStyle = {
    margin: '20px 10px',
    height: '40px',
    width: '80px',
}

function InsideHeader({updateProfileModal}) {

    return (
        <Header style={headerStyle}>
            <a><img style={imageStyle} src='logo-clr-sm.png' alt='logo'></img></a>
            <Button href="/" style={buttonStyle} type='deafult'>Logout</Button>
            <Button onClick={() => updateProfileModal(true)} style={buttonStyle} type='deafult'>Profile</Button>
        </Header>  
    );
}
  
export default InsideHeader;