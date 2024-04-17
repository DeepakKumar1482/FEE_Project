import { useState } from 'react'
import { app } from '../Firebase/config.js'
import { getAuth, createUserWithEmailAndPassword,signInWithPopup,GoogleAuthProvider} from 'firebase/auth'
import { Form, Input, message } from 'antd'
import { useNavigate,Link } from 'react-router-dom'
import Google from '../assets/Google.webp'
import {useParams} from 'react-router-dom'
import Loader from '../components/Loader/loader.jsx'
import axios from 'axios'
const Signup = () => {
    const param = useParams();
    const [loading,setloading]=useState(false)
    const googleauthProvider=new GoogleAuthProvider();
    const db= getAuth(app);
    const navigate = useNavigate();

    const signup = (values) => {
        setloading(true);
        createUserWithEmailAndPassword(db, values.email, values.password)
            .then(() => {
                message.success("Successfully Signedup");
                setloading(false);
                navigate('/layout');
            })
            .catch((error) => {
                console.error("Error signing up:", error.message);
                message.error("Emain already exist");
                setloading(false);
            });
    };
    const signupWithGoogle=()=>{
        signInWithPopup(db,googleauthProvider).then(()=>{
          message.success("Successfully Signedup"); 
          navigate('/layout');
        }).catch(()=>{
            message.error("Wrong Credentials");
        })
    }

    const signin=async(values)=>{
        try{
            const res=await axios.post('http://localhost:8080/api/user/logincheck',{...values});
            if(res.data.success) {
                message.success(res.data.message);
                navigate('/layout');
            }else{
                message.error(res.data.message);
            }
        }catch(e){
            console.log(e);
        }
    }
    return (
        <div className='h-screen w-screen flex justify-center items-center text-center'>
            <div className='w-1/3 h-auto pb-5 shadow-md rounded-md border border-gray-300 px-10'>
                    {param.signup=='signup' ?
                <Form onFinish={signup} className='pt-10'>
                    <Form.Item name='email'>
                        <Input placeholder='Email' />
                    </Form.Item>
                    <Form.Item name='password'>
                        <Input placeholder='Password' />
                    </Form.Item>
                    <button type='submit' className='w-full h-11 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 transition ease-in-out duration-500'>
                        Signup with mail
                    </button> 
                    <button onClick={signupWithGoogle} className='w-full text-black flex justify-center items-center gap-x-4 shadow-md hover:bg-gray-200 transition ease-in-out duration-500 font-bold py-2 px-4 rounded mb-1'>
                    Signup with Google<img className='w-7 h-7' src={Google} alt="" />
                    </button>
                    
                </Form>:
                    <Form onFinish={signin} className='pt-10'>
                        <Form.Item name='username'>
                            <Input placeholder='username' />
                        </Form.Item>
                        <Form.Item name='password'>
                            <Input.Password type='password' placeholder='Password' />
                        </Form.Item>
                        <button className='w-full h-11 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-4 rounded transition ease-in-out duration-500'>Login</button>
                    </Form>
                    }
                {
                param.signup=='signin'&&<Link to={'/signup'} className='text-blue-200 transition ease-in-out duration-500 hover:text-blue-400'>Don't have an account? </Link>
                }
           </div>{
               loading&&<Loader/>
           }
        </div>
    );
};

export default Signup;


 