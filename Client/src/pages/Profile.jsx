import { Form, Input, Select, message } from "antd";
import { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import axios from "axios";
import { app } from "../Firebase/config";
import SideImage from "../assets/ProfileSide.png";
import Formbackground from "../assets/Formbackground.jpg";
const { Option } = Select;
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/loader";
import { ParticlesComponent } from "../components";
import { useUser } from "../ContextApi/UserContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const Profile = () => {
  const navigate = useNavigate();
  // const [imageurl, setImageUrl] = useState("");
  const [githubid, setGithubName] = useState(null);
  const [userName, setUserName] = useState(null);
  // const [isUserExist, setIsUserExist] = useState(0);
  // const [val, setval] = useState({});
  // const [temp, settemp] = useState(0);
  // const [flag, setflag] = useState(0);
  const { userData } = useUser();
  const { email, password } = userData;
  console.log("this is email -> ", email);
  console.log("This is password -> ", password);
  const [loading, setloading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const universities = [
    "IIT Bombay",
    "IIT Delhi",
    "IIT Madras",
    "IIT Kanpur",
    "IIT Kharagpur",
    "BITS Pilani",
    "NIT Trichy",
    "IIIT Hyderabad",
    "IIIT Delhi",
    "NSIT Delhi",
    "DTU Delhi",
    "VIT Vellore",
    "SRM Chennai",
    "Manipal Institute of Technology",
    "Chitkara University",
    "Lovely Professional University",
    "Amity University",
    "Thapar Institute of Engineering and Technology",
    "SRM Institute of Science and Technology",
    "BITS Hyderabad",
    "NIT Warangal",
    "NIT Surathkal",
    "NIT Calicut",
    "PSG College of Technology",
    "Birla Institute of Technology, Mesra",
    "Thiagarajar College of Engineering",
    "NIT Rourkela",
    "Anna University",
    "Delhi Technological University",
    "Birla Institute of Technology and Science, Pilani (BITS Pilani)",
    "Indian Institute of Engineering Science and Technology, Shibpur",
    "National Institute of Technology, Durgapur",
    "National Institute of Technology, Jamshedpur",
    "National Institute of Technology, Kurukshetra",
    "National Institute of Technology, Patna",
    "National Institute of Technology, Raipur",
    "National Institute of Technology, Silchar",
    "National Institute of Technology, Srinagar",
    "National Institute of Technology, Tiruchirappalli",
    "National Institute of Technology, Agartala",
    "National Institute of Technology, Hamirpur",
    "National Institute of Technology, Jalandhar",
    "National Institute of Technology, Meghalaya",
    "National Institute of Technology, Nagaland",
    "National Institute of Technology, Puducherry",
    "National Institute of Technology, Sikkim",
    "National Institute of Technology, Arunachal Pradesh",
    "National Institute of Technology, Goa",
    "National Institute of Technology, Manipur",
    "National Institute of Technology, Mizoram",
    "National Institute of Technology, Uttarakhand",
    "National Institute of Technology, Delhi",
    "National Institute of Technology, Andhra Pradesh",
    "Indian Institute of Information Technology, Allahabad",
    "Indian Institute of Information Technology, Design and Manufacturing, Jabalpur",
    "Indian Institute of Information Technology, Design and Manufacturing, Kancheepuram",
    "Indian Institute of Information Technology, Design and Manufacturing, Kurnool",
    "Indian Institute of Information Technology, Guwahati",
    "Indian Institute of Information Technology, Kota",
    "Indian Institute of Information Technology, Lucknow",
    "Indian Institute of Information Technology, Pune",
    "Indian Institute of Information Technology, Ranchi",
    "Indian Institute of Information Technology, Sri City",
  ];
  universities.sort();
  const techStack = [
    "React",
    "Vue",
    "Angular",
    "Node",
    "Express",
    "MongoDB",
    "MySQL",
    "Firebase",
    "Docker",
    "Kubernetes",
  ];
  techStack.sort();
  const provider = new GithubAuthProvider();
  const auth = getAuth(app);

  const githubAuthentication = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (githubid == null) {
      await signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GithubAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          setGithubName(user.reloadUserInfo.screenName);
          message.success("Signed in successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      message.error("Already Signed in");
    }
  };

  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };
  var formData = new FormData();
  formData.append("image", selectedImage);
  // formData.append("githubName", githubName);
  function validateName(name) {
    const nameRegex = /^[a-zA-Z]+(?:[ '-][a-zA-Z]+)*$/;

    if (!name || name.length < 1 || name.length > 50) {
      message.info("Error: Name must be between 1 and 50 characters.");
      return false;
    }

    if (!nameRegex.test(name)) {
      message.info("Error: Name contains invalid characters or formatting.");
      return false;
    }

    // message.info("Valid name.");
    return true;
  }

  function validateUsername(username) {
    const usernameRegex = /^(?!.*[._]{2})[a-zA-Z0-9._]{3,30}$/;

    if (!username || username.length < 3 || username.length > 30) {
      message.info("Error: Username must be between 3 and 30 characters.");
      return false;
    }

    if (!usernameRegex.test(username)) {
      message.info(
        "Error: Username contains invalid characters or formatting."
      );
      return false;
    }

    if (
      username.startsWith(".") ||
      username.startsWith("_") ||
      username.endsWith(".") ||
      username.endsWith("_")
    ) {
      message.info("Error: Username cannot start or end with '.' or '_'.");
      return false;
    }

    // message.info("Valid username.");
    return true;
  }

  const uploaduser = async (values, e) => {
    // if(!userData.token){
    //   message.error("Please Register first");
    //   return;
    // }
    const nameCheck = validateName(values.name);
    if (!nameCheck) {
      return;
    }
    const usernameCheck = validateUsername(values.username);
    if (!usernameCheck) {
      return;
    }
    if (!selectedImage) {
      message.info("Please select an image");
      return;
    }
    if (!values.university) {
      message.info("Please select a university");
      return;
    }
    if (!values.techStack) {
      message.info("Please select a techStack");
      return;
    }
    if (!githubid) {
      message.info("Please authenticate with github");
      return;
    }
    formData.append("name", values.name);
    formData.append("username", values.username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("techStack", values.techStack);
    formData.append("githubid", githubid);
    formData.append("university", values.university);
    formData.append("Email", email);
    formData.append("Password", password);
    console.log("This is Form data -> ", formData);
    // name, username, password, university, techStack
    try {
      const res = await axios.post(
        "http://localhost:8080/api/user/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("username", values.username);
        console.log(res.data.token);
        message.success("Saved");
        navigate("/");
      } else {
        formData = new FormData();
        message.error(res.data.message);
      }
    } catch (e) {
      formData = new FormData();
      console.log(e);
    }
    e.preventDefault();
  };
  console.log("userdata: ", userData.token);
  return (
    <div>
      <ParticlesComponent />
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="flex w-full h-full justify-evenly items-center pr-8">
          <DotLottieReact
            className="w-[50rem] h-[40rem] z-10"
            src="https://lottie.host/75c0a6cb-1e06-43dd-9038-c3a263ab380b/HN8Gmvd2Sp.json"
            loop
            autoplay
          />
          <div className="h-fit w-[38rem] z-10 rounded-md flex flex-col backdrop-blur-sm bg-black/30 items-center justify-center mx-2 gap-6 border-[1px] py-6">
            <div className="w-full flex justify-center items-end">
              <label
                htmlFor="file-input"
                className="h-20 w-20 flex items-center justify-center"
              >
                {selectedImage ? (
                  <img
                    className="h-full z-10 w-full object-cover rounded-full hover:cursor-pointer"
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Image"
                  />
                ) : (
                  <span className="text-6xl p-2 text-white hover:cursor-pointer relative border  rounded-full flex items-center justify-center">
                    <i className="bx bx-user-plus"></i>
                  </span>
                )}
              </label>
              <input
                name="image"
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="w-full flex justify-center">
              <Form
                onFinish={uploaduser}
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
                {/* <Form.Item name="password" className="">
                  <Input
                    className="bg-transparent focus:bg-transparent hover:bg-transparent text-white h-12 text-lg placeholder:text-gray-400 placeholder:text-base rounded-lg"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item> */}
                <Form.Item name="university" className="">
                  <Select
                    mode="single"
                    className="w-full custom-select"
                    placeholder="University"
                  >
                    {universities.map((university) => (
                      <Option key={university} value={university}>
                        {university}
                      </Option>
                    ))}
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
