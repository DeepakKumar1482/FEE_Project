import { Form, Input, Select, Button, message } from 'antd';
import { useState } from 'react';
const { Option } = Select;
import axios from 'axios';
import { app } from './Firebase/config';
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

const Profile = () => {
  const [selectedimage, setSelectedImage] = useState(null);
  const[imageurl,setimageurl]=useState(null);
  const[githubName,setgithubName]=useState(null);
  const handlefilechange = (event) => {
    setSelectedImage(event.target.files[0]);
  }
  const cloudinaryUpload=async()=>{
    const data = new FormData();
    data.append('file', selectedimage);
    data.append('upload_preset', 'codebuddy');
    data.append('cloud_name', 'dhrahulpp');
    await axios.post('https://api.cloudinary.com/v1_1/dhrahulpp/image/upload', data)
    .then((response) => {
      setimageurl(response.data.secure_url);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  const provider = new GithubAuthProvider();
  const auth = getAuth(app);
  const GithubAuthentication=()=>{
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    console.log('Toekn=>',token);
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    console.log('User',user);
    setgithubName(user.reloadUserInfo.screenName);
  }).catch((error) => {
    console.log(error);
  });
  }
  const Formdata=async(values)=>{
    try{
      if(githubName==null){
        message.error('Please Sign in with Github');
        return;
      }
      if(imageurl==null){
        message.error('Please upload image');
        return ;
      }
      const res=await axios.post('http://localhost:8080/api/user/createuser',{githubName,imageurl,...values});
    if(res.data.success){
      message.success('Saved');
    }
    }catch(e){
      console.log(e);
    }
  }
  const callboth=async(values)=>{
    await cloudinaryUpload();
    await Formdata(values);
  }
  return(
    <div className='h-full w-full  flex-col'>
      <div className='h-1/6 w-full flex justify-center items-center'>
      <label htmlFor="file-input" className="h-20 w-20 flex items-center justify-center">
  {
    selectedimage ? 
    <img className='h-full w-full object-cover rounded-full hover:cursor-pointer' src={URL.createObjectURL(selectedimage)} alt="Selected Image" /> :
    <span className='text-5xl text-white hover:cursor-pointer relative border border-white rounded-full flex items-center justify-center'>
      <i className='bx bx-user-plus'></i>
    </span>
  }
</label>

      <input
        id="file-input"
        type="file"
        onChange={handlefilechange}
        className="hidden"
      />
      {/* <h1 className='text-4xl font-bold text-white'><input type="file" /> +</h1> */}
      </div>
      <div className='h-5/6 w-full flex justify-center'>
    <Form onFinish={callboth} className='bg-purple-600 w-2/3 h-4/5 flex flex-col px-10 justify-center'>
      <Form.Item name='name' className=''>
        <Input placeholder='Name' />
      </Form.Item>
      <Form.Item name='username' className=''>
        <Input placeholder='Username' />
      </Form.Item>
      <Form.Item name='university' className=''>
  <Select mode='single' className='w-full' placeholder='University'>
    <Option value='IIT Bombay'>IIT Bombay</Option>
    <Option value='IIT Delhi'>IIT Delhi</Option>
    <Option value='IIT Madras'>IIT Madras</Option>
    <Option value='IIT Kanpur'>IIT Kanpur</Option>
    <Option value='IIT Kharagpur'>IIT Kharagpur</Option>
    <Option value='BITS Pilani'>BITS Pilani</Option>
    <Option value='NIT Trichy'>NIT Trichy</Option>
    <Option value='IIIT Hyderabad'>IIIT Hyderabad</Option>
    <Option value='IIIT Delhi'>IIIT Delhi</Option>
    <Option value='NSIT Delhi'>NSIT Delhi</Option>
    <Option value='DTU Delhi'>DTU Delhi</Option>
    <Option value='VIT Vellore'>VIT Vellore</Option>
    <Option value='SRM Chennai'>SRM Chennai</Option>
    <Option value='Manipal Institute of Technology'>Manipal Institute of Technology</Option>
    <Option value='Chitkara University'>Chitkara University</Option>
    <Option value='Lovely Professional University'>Lovely Professional University</Option>
    <Option value='Amity University'>Amity University</Option>
    <Option value='Thapar Institute of Engineering and Technology'>Thapar Institute of Engineering and Technology</Option>
    <Option value='SRM Institute of Science and Technology'>SRM Institute of Science and Technology</Option>
    <Option value='BITS Hyderabad'>BITS Hyderabad</Option>
    <Option value='NIT Warangal'>NIT Warangal</Option>
    <Option value='NIT Surathkal'>NIT Surathkal</Option>
    <Option value='NIT Calicut'>NIT Calicut</Option>
    <Option value='PSG College of Technology'>PSG College of Technology</Option>
    <Option value='Birla Institute of Technology, Mesra'>Birla Institute of Technology, Mesra</Option>
    <Option value='Thiagarajar College of Engineering'>Thiagarajar College of Engineering</Option>
    <Option value='NIT Rourkela'>NIT Rourkela</Option>
    <Option value='Anna University'>Anna University</Option>
    <Option value='Delhi Technological University'>Delhi Technological University</Option>
    <Option value='Birla Institute of Technology and Science, Pilani (BITS Pilani)'>Birla Institute of Technology and Science, Pilani (BITS Pilani)</Option>
    <Option value='Indian Institute of Engineering Science and Technology, Shibpur'>Indian Institute of Engineering Science and Technology, Shibpur</Option>
    <Option value='National Institute of Technology, Durgapur'>National Institute of Technology, Durgapur</Option>
    <Option value='National Institute of Technology, Jamshedpur'>National Institute of Technology, Jamshedpur</Option>
    <Option value='National Institute of Technology, Kurukshetra'>National Institute of Technology, Kurukshetra</Option>
    <Option value='National Institute of Technology, Patna'>National Institute of Technology, Patna</Option>
    <Option value='National Institute of Technology, Raipur'>National Institute of Technology, Raipur</Option>
    <Option value='National Institute of Technology, Silchar'>National Institute of Technology, Silchar</Option>
    <Option value='National Institute of Technology, Srinagar'>National Institute of Technology, Srinagar</Option>
    <Option value='National Institute of Technology, Tiruchirappalli'>National Institute of Technology, Tiruchirappalli</Option>
    <Option value='National Institute of Technology, Agartala'>National Institute of Technology, Agartala</Option>
    <Option value='National Institute of Technology, Hamirpur'>National Institute of Technology, Hamirpur</Option>
    <Option value='National Institute of Technology, Jalandhar'>National Institute of Technology, Jalandhar</Option>
    <Option value='National Institute of Technology, Meghalaya'>National Institute of Technology, Meghalaya</Option>
    <Option value='National Institute of Technology, Nagaland'>National Institute of Technology, Nagaland</Option>
    <Option value='National Institute of Technology, Puducherry'>National Institute of Technology, Puducherry</Option>
    <Option value='National Institute of Technology, Sikkim'>National Institute of Technology, Sikkim</Option>
    <Option value='National Institute of Technology, Arunachal Pradesh'>National Institute of Technology, Arunachal Pradesh</Option>
    <Option value='National Institute of Technology, Goa'>National Institute of Technology, Goa</Option>
    <Option value='National Institute of Technology, Manipur'>National Institute of Technology, Manipur</Option>
    <Option value='National Institute of Technology, Mizoram'>National Institute of Technology, Mizoram</Option>
    <Option value='National Institute of Technology, Uttarakhand'>National Institute of Technology, Uttarakhand</Option>
    <Option value='National Institute of Technology, Delhi'>National Institute of Technology, Delhi</Option>
    <Option value='National Institute of Technology, Andhra Pradesh'>National Institute of Technology, Andhra Pradesh</Option>
    <Option value='National Institute of Technology, Arunachal Pradesh'>National Institute of Technology, Arunachal Pradesh</Option>
    <Option value='National Institute of Technology, Jamshedpur'>National Institute of Technology, Jamshedpur</Option>
    <Option value='Indian Institute of Information Technology, Allahabad'>Indian Institute of Information Technology, Allahabad</Option>
    <Option value='Indian Institute of Information Technology, Design and Manufacturing, Jabalpur'>Indian Institute of Information Technology, Design and Manufacturing, Jabalpur</Option>
    <Option value='Indian Institute of Information Technology, Design and Manufacturing, Kancheepuram'>Indian Institute of Information Technology, Design and Manufacturing, Kancheepuram</Option>
    <Option value='Indian Institute of Information Technology, Design and Manufacturing, Kurnool'>Indian Institute of Information Technology, Design and Manufacturing, Kurnool</Option>
    <Option value='Indian Institute of Information Technology, Guwahati'>Indian Institute of Information Technology, Guwahati</Option>
    <Option value='Indian Institute of Information Technology, Kota'>Indian Institute of Information Technology, Kota</Option>
    <Option value='Indian Institute of Information Technology, Lucknow'>Indian Institute of Information Technology, Lucknow</Option>
    <Option value='Indian Institute of Information Technology, Pune'>Indian Institute of Information Technology, Pune</Option>
    <Option value='Indian Institute of Information Technology, Ranchi'>Indian Institute of Information Technology, Ranchi</Option>
    <Option value='Indian Institute of Information Technology, Sri City'>Indian Institute of Information Technology, Sri City</Option>
    </Select>
      </Form.Item>
      <Form.Item name='techStack' className=''>
        <Select mode='multiple' className='w-full' placeholder='Technologies'>
          <Option value='React'>React</Option>
          <Option value='Vue'>Vue</Option>
          <Option value='Angular'>Angular</Option>
          <Option value='Node'>Node</Option>
          <Option value='Express'>Express</Option>
          <Option value='MongoDB'>MongoDB</Option>
          <Option value='MySQL'>MySQL</Option>
          <Option value='Firebase'>Firebase</Option>
          <Option value='Docker'>Docker</Option>
          <Option value='Kubernetes'>Kubernetes</Option>
        </Select>
      </Form.Item>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5' onClick={GithubAuthentication}>Github</button>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={callboth}>Create Profile</button>
    </Form>
    </div>
  </div>
  )
};

export default Profile;