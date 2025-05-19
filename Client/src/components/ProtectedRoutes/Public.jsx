import React from 'react';
import { Navigate } from 'react-router-dom';
import ParticlesComponent from '../ParticlesComponent';
function PublicRoute({children}){
    if(localStorage.getItem("token")){
        return <Navigate to={'/'}/>
    }else{
        return (
            <>
                <ParticlesComponent/>
                {children}
            </>
        );
    }
}
export default PublicRoute;