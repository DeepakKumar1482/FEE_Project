import { Form, Input, Select, message } from 'antd';
import { useState ,useEffect} from 'react';
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import axios from 'axios';
import { app } from '../Firebase/config';
import SideImage from '../assets/ProfileSide.png'
import Formbackground from '../assets/Formbackground.jpg'
const { Option } = Select;
import {useNavigate} from 'react-router-dom'
import Loader from '../components/Loader/loader';
import {ParticlesComponent} from "../components"
const Profile = () => {
  const navigate=useNavigate();
  const [selectedimage, setSelectedImage] = useState(null);
  const [imageurl, setImageUrl] = useState('');
  const [githubName, setGithubName] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isUserExist, setIsUserExist] = useState(0);
  const [val,setval]=useState({});
  const[temp,settemp]=useState(0);
  const[flag,setflag]=useState(0);
  const[loading,setloading]=useState(false);
  const universities = [
    'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur', 'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad',
    'IIIT Delhi', 'NSIT Delhi', 'DTU Delhi', 'VIT Vellore', 'SRM Chennai', 'Manipal Institute of Technology', 'Chitkara University',
    'Lovely Professional University', 'Amity University', 'Thapar Institute of Engineering and Technology', 'SRM Institute of Science and Technology',
    'BITS Hyderabad', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut', 'PSG College of Technology', 'Birla Institute of Technology, Mesra',
    'Thiagarajar College of Engineering', 'NIT Rourkela', 'Anna University', 'Delhi Technological University', 'Birla Institute of Technology and Science, Pilani (BITS Pilani)',
    'Indian Institute of Engineering Science and Technology, Shibpur', 'National Institute of Technology, Durgapur', 'National Institute of Technology, Jamshedpur',
    'National Institute of Technology, Kurukshetra', 'National Institute of Technology, Patna', 'National Institute of Technology, Raipur', 'National Institute of Technology, Silchar',
    'National Institute of Technology, Srinagar', 'National Institute of Technology, Tiruchirappalli', 'National Institute of Technology, Agartala',
    'National Institute of Technology, Hamirpur', 'National Institute of Technology, Jalandhar', 'National Institute of Technology, Meghalaya',
    'National Institute of Technology, Nagaland', 'National Institute of Technology, Puducherry', 'National Institute of Technology, Sikkim',
    'National Institute of Technology, Arunachal Pradesh', 'National Institute of Technology, Goa', 'National Institute of Technology, Manipur',
    'National Institute of Technology, Mizoram', 'National Institute of Technology, Uttarakhand', 'National Institute of Technology, Delhi',
    'National Institute of Technology, Andhra Pradesh',
    'Indian Institute of Information Technology, Allahabad', 'Indian Institute of Information Technology, Design and Manufacturing, Jabalpur',
    'Indian Institute of Information Technology, Design and Manufacturing, Kancheepuram', 'Indian Institute of Information Technology, Design and Manufacturing, Kurnool',
    'Indian Institute of Information Technology, Guwahati', 'Indian Institute of Information Technology, Kota', 'Indian Institute of Information Technology, Lucknow',
    'Indian Institute of Information Technology, Pune', 'Indian Institute of Information Technology, Ranchi', 'Indian Institute of Information Technology, Sri City'
  ];
  universities.sort();
  const techStack = ['React','Vue','Angular','Node','Express','MongoDB','MySQL','Firebase','Docker','Kubernetes']
  techStack.sort();
  useEffect(()=>{
    if(temp>0){
    formData(val);
    }
    settemp(()=>temp+1);
  },[imageurl]);
  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
  }

  const cloudinaryUpload = async () => {
    setloading(true);
    const data = new FormData();
    data.append('file', selectedimage);
    data.append('upload_preset', 'codebuddy');
    data.append('cloud_name', 'dhrahulpp');
      await axios.post('https://api.cloudinary.com/v1_1/dhrahulpp/image/upload', data).then((response) => {
      const url=response.data.secure_url;
      setImageUrl(url);
      }).catch((err) => {
        console.log(err);
      })
  }

  const provider = new GithubAuthProvider();
  const auth = getAuth(app);

  const githubAuthentication = async(e) => {
    e.preventDefault(); // Prevent form submission
    if(githubName==null){
    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        setGithubName(user.reloadUserInfo.screenName);
        message.success('Signed in successfully');
      }).catch((error) => {
        console.log(error);
      });
    }else{
      message.error('Already Signed in');
    }
  }

  const formData = async (values) => {
    try {
      const res = await axios.post('http://localhost:8080/api/user/createuser', { githubName, imageurl, ...values });
      if (res.data.success) {
        localStorage.setItem("token",res.data.token);
        message.success(res.data.message);
        navigate('/');
      } else {
        message.error(res.data.message);
      }
      setloading(false);
    } catch (e) {
      console.log(e);
    }
  }

  const UserExist = async (username) => {
    try {
      const res = await axios.post('http://localhost:8080/api/user/isUserExist', { user: username });
      if (res.data.success === false) {
        message.error("Username already taken");
        setIsUserExist(0);
      } else {
        setIsUserExist(res.data.data);
        console.log(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if(flag>0 && isUserExist!=0){
      if(githubName==null){
        message.error('Please Sign in with Github');
        return;
      }
      if(selectedimage!=null){
      cloudinaryUpload();
      }else{
        message.error('Please upload image');
        return;
      }
    }
    setflag(()=>flag+1);
  },[isUserExist])
  const callBoth = async (values) => {
    await UserExist(userName);
    if (isUserExist==true) {
      return;
    }
    setval(values);
  }
  return (
    <div>
      <ParticlesComponent />
      <div className="h-screen w-screen flex justify-center items-center">
      <div className='flex w-full h-full justify-center items-center pr-8'>
        <iframe className='z-10 w-1/2 h-full' src="https://lottie.host/embed/66a1ffad-f057-495a-a0eb-2d1baf3fb430/lF5aT9FYcp.json"></iframe>        
        <div className="h-fit w-[38rem] z-10 rounded-md flex flex-col backdrop-blur-sm bg-black/30 items-center justify-center mx-2 gap-6 border-[1px] py-6">
            <div className="w-full flex justify-center items-end">
              <label
                htmlFor="file-input"
                className="h-20 w-20 flex items-center justify-center"
              >
                {selectedimage ? (
                  <img
                    className="h-full z-10 w-full object-cover rounded-full hover:cursor-pointer"
                    src={URL.createObjectURL(selectedimage)}
                    alt="Selected Image"
                  />
                ) : (
                  <span className="text-6xl p-2 text-white hover:cursor-pointer relative border  rounded-full flex items-center justify-center">
                    <i className="bx bx-user-plus"></i>
                  </span>
                )}
              </label>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="w-full flex justify-center">
              <Form
                onFinish={callBoth}
                className="rounded-md w-full flex flex-col px-10 justify-center"
              >
                <Form.Item name="name" className="">
                  <Input
                    className="bg-transparent focus:bg-transparent hover:bg-transparent text-white h-12 text-lg placeholder:text-gray-400 placeholder:text-base rounded-lg"
                    placeholder="Name"
                  />
                </Form.Item>
                <Form.Item name="username" className="">
                  <Input
                    className="bg-transparent focus:bg-transparent hover:bg-transparent text-white h-12 text-lg placeholder:text-gray-400 placeholder:text-base rounded-lg"
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username"
                  />
                </Form.Item>
                <Form.Item name="password" className="">
                  <Input
                    className="bg-transparent focus:bg-transparent hover:bg-transparent text-white h-12 text-lg placeholder:text-gray-400 placeholder:text-base rounded-lg"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item name="university" className="">
                  <Select mode="single" className="w-full custom-select" placeholder="University">
                    {
                      universities.map((university) => (
                        <Option key={university} value={university}>
                          {university}
                        </Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item name="techStack" className="">
                  <Select
                    mode="multiple"
                    className="w-full appearance-none bg-transparent text-red-500"
                    placeholder="Technologies"
                  >
                    {techStack.map((techStack) => (
                      <Option key={techStack} value={techStack}>
                        {techStack}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <div className="h-full w-full z-10">
                  <button
                    className=" w-full bg-[#695CFE] hover:bg-[#574cd0] text-white font-bold py-2 px-4 rounded mb-5 transition ease-in-out duration-500 text-center"
                    onClick={githubAuthentication}
                  >
                    <span className=" flex justify-center items-center gap-x-2">
                      <i className="bx bxl-github text-xl"></i>Authenticate with
                      Github
                    </span>
                  </button>
                </div>
                <button
                  className="bg-[#695CFE] hover:bg-[#574cd0] text-white font-bold py-2 px-4 rounded transition ease-in-out duration-500 z-10"
                  type="submit"
                >
                  Join now
                </button>
              </Form>
            </div>
        </div>
      </div>
        {loading && <Loader />}
      </div>
    </div>
  );
};

export default Profile;
