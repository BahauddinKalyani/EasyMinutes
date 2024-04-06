import 'antd/dist/reset.css';
import './sidebar.css'
import React from 'react';
import { Menu, MenuProps, message } from 'antd';
import {
    FileImageOutlined,
    BgColorsOutlined,
    SettingOutlined,
    FunnelPlotOutlined,
    FileOutlined,
} from '@ant-design/icons';
import ApiService from '../../helpers/ApiService';

type MenuItem = Required<MenuProps>['items'][number];

const items:  MenuItem[]  = [
    getItem('File', 'sub5', <FileOutlined />, [
        getItem('New Image', '18'),
        getItem('Choose Image', '19'),
        getItem('Download Image', '20'),
    ]),
    getItem('Background', 'sub1', <BgColorsOutlined />, [
        getItem('Background Remove', '1'),
        getItem('Blur Background', '2'),
        getItem('Replace Background', '3'),
        // getItem('Reset Background', '4'),
    ]),
    getItem('Enhancements', 'sub2', <FileImageOutlined />, [
        getItem('Image Super Resolutions', '5'),
    ]),
    getItem('Transformations', 'sub3', <FunnelPlotOutlined />, [
        getItem('Cartoon', '6'),
        getItem('Sketch', '7'),
        getItem('Painting', '8'),
        getItem('Black & White', '9'),
    ]),
    getItem('Adjustments', 'sub4', <SettingOutlined />, [
        getItem('Change Brightness', '10'),
        getItem('Adjust Contrast', '11'),
        getItem('Change Hue', '12'),
        getItem('Change Saturation', '13'),
        getItem('Adjust Sharpness', '14'),
        getItem('Flip Image Horizontally', '15'),
        getItem('Flip Image Vertically', '16'),
    ]),
];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
}

const rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5'];


class SideBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          openKeys: ['sub1', 'sub2', 'sub5'],
        };
    }

    setOpenKeys(keys) {
      this.setState({
        openKeys: keys,
      });
    }

    onOpenChange(keys) {
      console.log(keys)
      const latestOpenKey = keys.find((key) => this.state.openKeys.indexOf(key) === -1);
      if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setOpenKeys(keys);
      } else {
        this.setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
      console.log(keys)
        
    }

    forceDownload = (blob, filename) => {
        var a = document.createElement('a');
        a.download = filename;
        a.href = blob;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

    downloadResource = (url, filename) => {
        if(!url){
            message.error("Please select an image first to download!")
            return
        }
        if (!filename) filename = url.split('\\').pop().split('/').pop();
        fetch(url, {
            headers: new Headers({
              'Origin': window.location.origin
            }),
            mode: 'cors'
          })
          .then(response => response.blob())
          .then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);
            this.forceDownload(blobUrl, filename);
          })
          .catch(e => console.error(e));
      }

    async handleClick(data){
        console.log(data)
        let imageUrl = ''
        let payload = {}
        let api_url = ''
        switch(data.key) {
            case '1':
                api_url = 'background_remove';
                break;
            case '2':
                api_url = 'background_blur';
                break;
            case '3':
                // imageUrl = await ApiService.blackAndWhite(this.props)
                // this.props.updateImageToState(imageUrl)
                this.props.updateUploadModal(true)
                break;
            case '5':
                api_url = 'image_super_resolution';
                break;
            case '6':
                api_url = 'cartoonification';
                break;
            case '7':
                api_url = 'sketching';
                break;
            case '8':
                api_url = 'painting';
                payload = { ...this.props, 
                    slider_action: api_url,
                    factor: 3,
                    save: 1,
                    revert: 0,
                }
                imageUrl = await ApiService.handleSettings(payload)
                this.props.updateImageToState(imageUrl)
                break;
            case '9':
                api_url = 'black_and_white'
                break;
            case '10':
                this.props.updateSliderAction('brightness')
                break;
            case '11':
                this.props.updateSliderAction('contrast')
                break;
            case '12':
                this.props.updateSliderAction('hue')
                break;
            case '13':
                this.props.updateSliderAction('saturation')
                break;
            case '14':
                this.props.updateSliderAction('sharpness')
                break;
            case '15':
                api_url = 'flip_horizontally';
                break;
            case '16':
                api_url = 'flip_vertically';
                break;
            case '18':
                this.props.updateImageToState(null)
                break;
            case '19':
                this.props.updateChooseModal(true)
                break;
            case '20':
                this.downloadResource(this.props.imageUrl);
                break;
            
            default:
                break;
        }

        const actionList = ['1', '2', '5', '6', '7', '8', '9', '15', '16']        
        if (actionList.includes(data.key)) {
            payload = { ...this.props, 
                api_url: api_url,
            }
            imageUrl = await ApiService.handleAction(payload)
            this.props.updateImageToState(imageUrl)
        }
        const actionList2 = ['10', '11', '12', '13', '14']
        if(!actionList2.includes(data.key)){
            this.props.updateSliderAction(null, false)
        }
    }

    render() {
        return (
            <div style={{ width: 256}}>
                <Menu
                    mode="inline"
                    theme="dark"
                    items={items}
                    openKeys={this.state.openKeys}
                    onClick={this.handleClick.bind(this)}
                    onOpenChange={this.onOpenChange.bind(this)}
                />
            </div>
        )
    }
}

export default SideBar;