import React,{useEffect} from 'react';
import { Navigate } from 'react-router-dom';
const ProtectedRoutes = ({children}) => {
    const token = localStorage.getItem('token');
    return (
        token ? children : <Navigate to="/signin"/>
    )
}
export default ProtectedRoutes;