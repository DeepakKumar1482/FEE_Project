import UploadImage from '../assets/UploadImage.svg'
import { useState,useEffect } from 'react'
import {Form,Input,message,Select}from 'antd'
const {Option}=Select;
import axios from 'axios';
import Loader from './Loader/loader';
const CreatePost = () => {
    const [selectedimage,setSelectedImage]=useState(null)
    const [imageurl, setImageUrl] = useState('');
    const[description,setDescription]=useState(null);
    const[temp,settemp]=useState(0);
    const[formvalues,setformvalues]=useState({});
    const[date,setDate]=useState('');
    const[time,setTime]=useState('');
    const[loader,setLoader]=useState(false);
    const handleFileChange = (event) => {
        setSelectedImage(event.target.files[0]);
      }
      const cloudinaryUpload = async () => {
        // setloading(true);
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
      const handleSubmit = async (values) => {
        try{
        setLoader(true);
        await cloudinaryUpload();
        setformvalues(values)
        }catch(e){
            console.log(e);
        }
          
      }
      useEffect(() => {
        if(temp>0){
            const currentDate = new Date().toISOString().slice(0, 10);
            const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
            setDate(currentDate);
            setTime(currentTime);
            submitPost(formvalues);
        }
        settemp(()=>temp+1);
      },[imageurl]);
      const submitPost = async (values) => {
          try{
            const res=await axios.post('http://localhost:8080/api/user/createpost', { imageurl, description,time,date,...values },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
        if(res.data.success) {
             message.success(res.data.message);
             setLoader(false);
         } else {
          message.error(res.data.message);
        }
          }catch(e){
            console.log(e);
          }
      }
      const Tech = ['React.js','Node.js','TypeScript','Docker','Kubernetes','GraphQL','Next.js','Tailwind CSS','Vue.js','Svelte','Python','Django','Flask',
      'FastAPI','JavaScript (ES6+)','HTML5','CSS3','Bootstrap','MongoDB','PostgreSQL','Redis','Elasticsearch','AWS (Amazon Web Services)','Google Cloud Platform (GCP)','Microsoft Azure',
      'Serverless','Machine Learning','Deep Learning','Blockchain','Git','GitHub','GitLab','Jenkins','CI/CD','Agile Methodology','DevOps','Microservices','RESTful APIs','GraphQL APIs','WebAssembly',
      'Rust','Go (Golang)','Kotlin','Swift','Flutter','TensorFlow','PyTorch','Apache Kafka','Apache Spark','Big Data','Data Science','Data Engineering','Cybersecurity','Artificial Intelligence (AI)',
      'Natural Language Processing (NLP)','Robotics','Internet of Things (IoT)','AR/VR (Augmented Reality/Virtual Reality)','UI/UX Design','Responsive Web Design','Progressive Web Apps (PWAs)'];
      Tech.sort();
  return (
    <div className='w-full h-auto'>
    <div className='w-full px-40 h-full overflow-auto'>
            <div className='w-full h-80  pt-5'>
            <div className='w-full h-full flex justify-center items-center  bg-orange-50 border border-dotted rounded-t-md'>
            <label className='h-full w-full p-4 flex justify-center' htmlFor="file-input">
                {
                    selectedimage ? <img className=' max-h-full w-full' src={URL.createObjectURL(selectedimage)} alt="Selected Image" /> : 
                    <div className='flex flex-col justify-center items-center gap-y-5'>
                    <img className='' src={UploadImage} alt="" />
                    <span className='border border-black cursor-pointer px-3 py-1 rounded-md flex items-center gap-x-2'><i className='bx bx-cloud-upload text-2xl'></i>Upload from you computer</span>
                    </div>
                }
            </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                /> 
            </div>
        </div>
        <div className='w-full h-auto  pb-10'>
            <div className='w-full h-4/5 border overflow-hidden border-gray-300 rounded-b-md'>
                <textarea onChange={(e)=>setDescription(e.target.value)} style={{resize:"none",outline:"none"}} className='w-full h-full p-2' placeholder='Write your post.......' name="" id="" cols="30" rows="10"></textarea>
            </div>
            <Form onFinish={handleSubmit} className='mt-5'>
                <Form.Item name='githubRepo'>
                    <Input placeholder='Github repository'/>
                </Form.Item>
                <Form.Item name='tech'>
                    <Select mode='multiple' placeholder='Tech used' className='w-full'>
                        {
                            Tech.map((tech)=>{
                                return <Option key={tech} value={tech}>{tech}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <button type='submit' className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-500'>Post now!</button>
            </Form>
        </div>
    </div>
    {loader && <Loader />}
    </div>
  )
}

export default CreatePost