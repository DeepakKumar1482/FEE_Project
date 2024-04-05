import { app } from '../Firebase/config.js'
import { getAuth, createUserWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,signInWithEmailAndPassword } from 'firebase/auth'
import { Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import Google from '../../public/Google.webp'
const Signin = () => {
    const googleauthProvider=new GoogleAuthProvider();
    const db= getAuth(app);
    const navigate = useNavigate();

    const signin=(values)=>{
        signInWithEmailAndPassword(db,values.email,values.password).then(()=>{
            message.success("Successfully Signedin");
            navigate('/')
        }).catch((e)=>{
            console.log(e);
            message.error("Signin Failed");
        })
    }
    const signupWithGoogle=()=>{
        signInWithPopup(db,googleauthProvider).then(()=>{
          message.success("Successfully Signedup"); 
          navigate('/');
        }).catch(()=>{
            message.error("Wrong Credentials");
        })
    }
    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <div className='w-1/3 h-1/2 shadow-md rounded-md border border-gray-300 px-10'>
                <Form onFinish={signin} className='pt-10'>
                    <Form.Item name='email'>
                        <Input placeholder='Email' />
                    </Form.Item>
                    <Form.Item name='password'>
                        <Input placeholder='Password' />
                    </Form.Item>
                    <button type='submit' className='w-full h-11 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4'>
                        Signin with mail
                    </button>
                </Form>
                <button onClick={signupWithGoogle} className='w-full text-black flex justify-center items-center gap-x-4 shadow-md hover:bg-gray-200 transition ease-in-out duration-1000 font-bold py-2 px-4 rounded'>
                    Signin with Google <img className='w-7 h-7' src={Google} alt="" />
                </button>
            </div>
        </div>
    );
};

export default Signin;
