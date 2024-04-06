import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
// import Landing from '../Landing';
// import WrapperEditMain from '../edit_screen/WrapperEditMain';


const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

//   return (
    // <Route
    //   {...rest}
    //   render={(props) =>
    //     isAuthenticated() ? <Component {...props} /> : <Navigate  to="/" />
    //   }
    // />
    // <Route
    //   {...rest}
    //   element={isAuthenticated() ? <Component {...rest} /> : <Navigate to="/" />}
    // />
//   );
    return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
    // return isAuthenticated() ? <Route path="/edit" element={<WrapperEditMain/>} /> : <Route path="/" element={<Landing/>}/>;
};

export default ProtectedRoute;