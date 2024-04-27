import UploadImage from '../assets/UploadImage.svg';
import { useState,useEffect } from 'react';
import {useNavigate}from 'react-router-dom'
import { Form, Input, message, Select } from 'antd';
import axios from 'axios';
import Loader from './Loader/loader';

const { Option } = Select;

const CreatePost = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [description, setDescription] = useState('');
  const [loader, setLoader] = useState(false);
  const[repos,setRepo]=useState({});
  const[temp,settemp]=useState(0);
  const[currDate,setcurrDate] = useState('')
  const[currTime,setcurrTime] = useState('');
  const navigate=useNavigate();
  useEffect(() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    const currentDate = `${day}-${month}-${year}`;
    const currentTime = `${formattedHours}:${minutes} ${amPm}`;

    setcurrDate(currentDate);
    setcurrTime(currentTime);
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedImages([...selectedImages, ...files]);
  };

  const cloudinaryUpload = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'codebuddy');
    data.append('cloud_name', 'dhrahulpp');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dhrahulpp/image/upload', data);
      return response.data.secure_url;
    } catch (error) {
      console.log(error);
      setLoader(false);
      message.error('Image size if too large');
      return null;
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoader(true);
      setRepo(values);
      const urls = await Promise.all(selectedImages.map(async (image) => await cloudinaryUpload(image)));
      setImageUrls(urls);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };
  const SavePost=async()=>{
    try{
      const res=await axios.post('http://localhost:8080/api/user/createpost',{imageUrls,description,...repos,currDate,currTime},
    {
      headers:{
        Authorization: 'Bearer '+localStorage.getItem('token')
      }
    });
    if(res.data.success){
      message.success('Saved');
      setLoader(false);
      navigate('/layout');
    }
    }catch (error) {
      console.log(error);
      setLoader(false);
    }
  }
  useEffect(()=>{
    if(temp>0){
    SavePost();
    }
    settemp((val)=>val+1);
  },[imageUrls]);
  const Tech = ['React.js','Node.js','TypeScript','Docker','Kubernetes','GraphQL','Next.js','Tailwind CSS','Vue.js','Svelte','Python','Django','Flask',
  'FastAPI','JavaScript (ES6+)','HTML5','CSS3','Bootstrap','MongoDB','PostgreSQL','Redis','Elasticsearch','AWS (Amazon Web Services)','Google Cloud Platform (GCP)','Microsoft Azure',
    'Serverless','Machine Learning','Deep Learning','Blockchain','Git','GitHub','GitLab','Jenkins','CI/CD','Agile Methodology','DevOps','Microservices','RESTful APIs','GraphQL APIs','WebAssembly',
    'Rust','Go (Golang)','Kotlin','Swift','Flutter','TensorFlow','PyTorch','Apache Kafka','Apache Spark','Big Data','Data Science','Data Engineering','Cybersecurity','Artificial Intelligence (AI)',
    'Natural Language Processing (NLP)','Robotics','Internet of Things (IoT)','AR/VR (Augmented Reality/Virtual Reality)','UI/UX Design','Responsive Web Design','Progressive Web Apps (PWAs)'];
  Tech.sort();
  return (
    <div className='w-full h-auto'>
      <div className='w-full px-40 h-full overflow-auto'>
        {/* Image upload section */}
        <div className='w-full h-80 pt-5'>
          <div className='w-full h-full flex justify-center items-center bg-orange-50 border border-dotted rounded-t-md'>
            <label className='h-full w-full p-4 flex justify-center' htmlFor="file-input">
              {selectedImages.length > 0 ? (
                <div className={`grid grid-cols-${Math.min(2, selectedImages.length)} gap-4 overflow-auto`}>
                {selectedImages.map((image, index) => (
                  <img key={index} className='h-auto w-auto' src={URL.createObjectURL(image)} alt="Selected Image" />
                ))}
              </div>
              ) : (
                <div className='flex flex-col justify-center items-center gap-y-5'>
                  <img className='' src={UploadImage} alt="" />
                  <span className='border border-black cursor-pointer px-3 py-1 rounded-md flex items-center gap-x-2'><i className='bx bx-cloud-upload text-2xl'></i>Upload from your computer</span>
                </div>
              )}
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </div>
        </div>
        {/* Form section */}
        <div className='w-full h-auto pb-10'>
          <div className='w-full h-4/5 border overflow-hidden border-gray-300 rounded-b-md'>
            <textarea onChange={(e) => setDescription(e.target.value)} style={{ resize: "none", outline: "none" }} className='w-full h-full p-2' placeholder='Write your post.......' name="" id="" cols="30" rows="10"></textarea>
          </div>
          <Form onFinish={handleSubmit} className='mt-5'>
            <Form.Item name='githubRepo'>
              <Input placeholder='Github repository' />
            </Form.Item>
            <Form.Item name='tech'>
              <Select mode='multiple' placeholder='Tech used' className='w-full'>
                {Tech.map((tech) => (
                  <Option key={tech} value={tech}>{tech}</Option>
                ))}
              </Select>
            </Form.Item>
            <button type='submit' className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-500'>Post now!</button>
          </Form>
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
}

export default CreatePost;
