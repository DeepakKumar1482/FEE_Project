import { useState ,useEffect} from 'react'
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
    const[LoginData,setLoginData]=useState('');
    const[temp,settemp]=useState(0);
    const[flag,setflag]=useState(false);
    useEffect(()=>{
        if(temp>0){
        SignupwithMail()
        }
        if(!flag){
            SetEmailPassword()
        }
        settemp(()=>temp+1);
    },[LoginData])
    const SetEmailPassword=async()=>{
        try{
            const res=await axios.post('http://localhost:8080/api/user/createuser',LoginData);
            
        }catch(e){
            console.log('error', e);
        }
    }
    const signup = (values) => {
        setLoginData(values.email);
    };
    const SignupwithMail=async()=>{
        setloading(true);
        console.log("This is logindata -> ",LoginData);
        createUserWithEmailAndPassword(db, LoginData.email, LoginData.password)
            .then(() => {
                message.success("Successfully Signedup");
                setloading(false);
                navigate('/layout');
            })
            .catch((error) => {
                message.error('Email already exists');
                setflag(true);
                setloading(false);
            });
    }
    const signupWithGoogle=()=>{
        signInWithPopup(db, googleauthProvider)
  .then((result) => {
    const user = result.user;
    console.log(user);
    console.log(user.email);
    const creationTime = user.metadata.creationTime;
    const creationObject = new Date(creationTime);
    const hours = creationObject.getHours().toString().padStart(2, '0'); 
    const minutes = creationObject.getMinutes().toString().padStart(2, '0');
    const seconds = creationObject.getSeconds().toString().padStart(2, '0');

    const creationtimeString = `${hours}${minutes}${seconds}`;

    const lastloginTime=user.metadata.lastSignInTime;
    const lastloginObject = new Date(lastloginTime);
    const lastloginhours = lastloginObject.getHours().toString().padStart(2, '0'); 
    const lastloginminutes = lastloginObject.getMinutes().toString().padStart(2, '0'); 
    const lastloginseconds = creationObject.getSeconds().toString().padStart(2, '0'); 
    const lastlogintimeString = `${lastloginhours}${lastloginminutes}${lastloginseconds}`;
    console.log(creationtimeString);
    console.log(lastlogintimeString);
    if(creationtimeString==lastlogintimeString){
        message.success('Signed in successfully');
        navigate('/layout');
    }else{
        message.error('Already have an account');
        navigate('/signin');
    }
  }).catch((error) => {
    console.log('error', error);
  });
    }

    const signin=async(values)=>{
        try{
            setloading(true);
            const res=await axios.post('http://localhost:8080/api/user/logincheck',{...values});
            if(res.data.success) {
                message.success(res.data.message);
                localStorage.setItem("token",res.data.token);
                navigate('/layout');
            }else{
                message.error(res.data.message);
            }
            setloading(false);
        }catch(e){
            setloading(false);
            message.error('Please enter username and password');
            console.log(e);
        }
    }
    
    return (
        <div className='h-screen w-screen flex justify-center items-center text-center'>
            <div className='w-1/3 h-auto pb-5 shadow-md rounded-md border border-gray-300 px-10'>
                    {param.signup=='signup' ?
                    <div>
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
                </Form>
                <button onClick={signupWithGoogle} className='w-full text-black flex justify-center items-center gap-x-4 shadow-md hover:bg-gray-200 transition ease-in-out duration-500 font-bold py-2 px-4 rounded mb-1'>
                Signup with Google<img className='w-7 h-7' src={Google} alt="" />
                </button>
                </div>
                :
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


