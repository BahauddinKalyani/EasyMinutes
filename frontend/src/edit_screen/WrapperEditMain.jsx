import { useLocation } from 'react-router-dom';
import EditMain from './EditMain';

const WrapperEditMain = props => {
    const location = useLocation()
    return <EditMain location={location} {...props} />
}

export default WrapperEditMain;