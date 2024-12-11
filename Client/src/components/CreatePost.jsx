import UploadImage from "../assets/UploadImage.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, message, Select } from "antd";
import axios from "axios";
import Loader from "./Loader/loader";
import Tech from "../Data/TechData";
const { Option } = Select;

const CreatePost = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [loader, setLoader] = useState(false);
  const [repos, setRepo] = useState({});
  const [temp, setTemp] = useState(0);
  const [currDate, setCurrDate] = useState("");
  const [currTime, setCurrTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    const currentDate = `${day}-${month}-${year}`;
    const currentTime = `${formattedHours}:${minutes} ${amPm}`;
    setCurrDate(currentDate);
    setCurrTime(currentTime);
  }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    const validImages = files.filter((file) =>
      allowedTypes.includes(file.type)
    );

    const invalidImages = files.filter((file) => !allowedTypes.includes(file.type));
    if (invalidImages.length > 0) {
      invalidImages.forEach((file) =>
        message.error(`Invalid file type: ${file.name}`)
      );
    }

    setSelectedImages((prev) => [...prev, ...validImages]);
    event.target.value = ""; // Clear input value to allow re-selection
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const cloudinaryUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "codebuddy");
    data.append("cloud_name", "dhrahulpp");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhrahulpp/image/upload",
        data
      );
      return response.data.secure_url;
    } catch (error) {
      console.error(error);
      setLoader(false);
      message.error("Image size is too large");
      return null;
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoader(true);
      setRepo(values);
      const urls = await Promise.all(
        selectedImages.map(async (image) => await cloudinaryUpload(image))
      );
      setImageUrls(urls);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  const savePost = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/user/createpost",
        { imageUrls, description, ...repos, currDate, currTime },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success("Post saved successfully!");
        setLoader(false);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (temp > 0) {
      savePost();
    }
    setTemp((val) => val + 1);
  }, [imageUrls]);


  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8 w-[40%] dark:text-white">
      <div className="w-full max-w-6xl bg-gray-50 dark:bg-[#171717] shadow-md rounded-lg p-6 dark:text-white">
        {/* Image Upload Section */}
        <div className="mb-6">
          <div className="border border-dashed border-gray-300 dark:border-[#161616] rounded-lg p-4">
            <div className="flex flex-col items-center">
              {selectedImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        className="w-32 h-32 object-cover rounded-md"
                        src={URL.createObjectURL(image)}
                        alt="Selected"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-700 transition duration-200"
                        onClick={() => removeImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-600 dark:text-white">
                  <img src={UploadImage} alt="Upload" className="w-16 mb-4" />
                  <span className="text-sm font-semibold">
                    Drag and drop or click to upload images
                  </span>
                </div>
              )}
            </div>

            {/* File Input Button */}
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700 transition duration-300"
              onClick={() => document.getElementById("file-input").click()}
            >
              Upload Image
            </button>
            <input
              id="file-input"
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Description Section */}
        <textarea
          className="w-full h-32 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md p-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none mb-6"
          placeholder="Write your post here..."
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Form Section */}
        <Form onFinish={handleSubmit} layout="vertical" className="dark:text-white">
          <Form.Item name="githubRepo" label="GitHub Repository">
            <Input
              placeholder="Enter GitHub repository link"
              className="dark:bg-transparent dark:text-white"
            />
          </Form.Item>
          <Form.Item name="tech" label="Technologies Used">
            <Select
              mode="multiple"
              placeholder="Select technologies used"
              className="dark:bg-transparent dark:text-white"
            >
              {Tech.map((tech) => (
                <Option key={tech} value={tech}>
                  {tech}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Post Now!
          </button>
        </Form>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default CreatePost;
