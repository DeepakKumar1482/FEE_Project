import { useState } from "react";
import { app } from "../Firebase/config.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { Form, Input, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Google from "../assets/Google.webp";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader/loader.jsx";
import axios from "axios";
import {ParticlesComponent} from "../components"

const Signup = () => {
  const param = useParams();
  const [loading, setloading] = useState(false);
  const googleauthProvider = new GoogleAuthProvider();
  const db = getAuth(app);
  const navigate = useNavigate();
  const SignupwithMail = async (values) => {
    setloading(true);
    createUserWithEmailAndPassword(db, values.email, values.password)
      .then(() => {
        message.success("Successfully Signedup");
        setloading(false);
        navigate("/profile");
      })
      .catch((error) => {
        message.error("Email already exists");
        setloading(false);
      });
  };
  const signupWithGoogle = () => {
    signInWithPopup(db, googleauthProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        console.log(user.email);
        const creationTime = user.metadata.creationTime;
        const creationObject = new Date(creationTime);
        const hours = creationObject.getHours().toString().padStart(2, "0");
        const minutes = creationObject.getMinutes().toString().padStart(2, "0");
        const seconds = creationObject.getSeconds().toString().padStart(2, "0");

        const creationtimeString = `${hours}${minutes}${seconds}`;

        const lastloginTime = user.metadata.lastSignInTime;
        const lastloginObject = new Date(lastloginTime);
        const lastloginhours = lastloginObject
          .getHours()
          .toString()
          .padStart(2, "0");
        const lastloginminutes = lastloginObject
          .getMinutes()
          .toString()
          .padStart(2, "0");
        const lastloginseconds = creationObject
          .getSeconds()
          .toString()
          .padStart(2, "0");
        const lastlogintimeString = `${lastloginhours}${lastloginminutes}${lastloginseconds}`;
        console.log(creationtimeString);
        console.log(lastlogintimeString);
        if (creationtimeString == lastlogintimeString) {
          message.success("Signed up successfully");
          navigate("/profile");
        } else {
          message.error("Already have an account");
          navigate("/signin");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const signin = async (values) => {
    try {
      setloading(true);
      const res = await axios.post(
        "http://localhost:8080/api/user/logincheck",
        { ...values }
      );
      if (res.data.success) {
        message.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
      setloading(false);
    } catch (e) {
      setloading(false);
      message.error(e);
      console.log(e);
    }
  };

  return (
    <div>
      <ParticlesComponent/>
      <div className="h-screen w-screen flex flex-col bg-[#242526] justify-center items-center text-center">
        <div className="z-10 ">
          <h1 className="text-4xl bg-white/10 backdrop-blur-sm rounded-lg p-2 text-[#695CFE] font-[550] mb-20 mt-10">CODEBUDDY</h1>
        </div>
        <div className="flex justify-center items-center w-full h-full mb-10">
          {/* <div className="z-10">
            <iframe
              className=""
              width={"500px"}
              height={"500px"}
              src="https://lottie.host/embed/4e17d12d-4854-4853-9af5-6cc422efb7c7/RkWVXKVPNq.json"
            ></iframe>
          </div> */}
          <div className="w-fit flex justify-center backdrop-blur-sm bg-black/30 h-full">
            <div className="w-96 h-auto pb-5 bgpu6 px-10 shadow-lg  rounded-md border border-gray-300">
              {param.signup == "signup" ? (
                <div className="">
                  <Form onFinish={signup} className="pt-10 w-72">
                    <Form.Item name="email">
                      <Input className="" placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="password">
                      <Input placeholder="Password" />
                    </Form.Item>
                    <button
                      type="submit"
                      className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4 transition ease-in-out duration-500"
                    >
                      Signup with mail
                    </button>
                  </Form>
                  <button
                    onClick={signupWithGoogle}
                    className="w-full text-black flex justify-center items-center gap-x-4 shadow-md hover:bg-gray-200 transition ease-in-out duration-500 font-bold py-2 px-4 rounded mb-1"
                  >
                    Signup with Google
                    <img className="w-7 h-7" src={Google} alt="" />
                  </button>
                </div>
              ) : (
                <Form onFinish={signin} className="pt-10 w-full h-full flex flex-col justify-center -mt-10">
                  <Form.Item  name="username">
                    <Input className="bg-transparent focus:bg-transparent hover:bg-transparent text-white h-12 text-lg placeholder:text-gray-400 placeholder:text-base" placeholder="Username" />
                  </Form.Item>
                  <Form.Item name="password">
                    <Input className="bg-transparent focus:bg-transparent hover:bg-transparent focus-within:bg-transparent text-white h-12 text-lg placeholder:text-gray-400 placeholder:text-base" type="password" placeholder="Password" />
                  </Form.Item>
                  <button className="w-full h-11 bg-[#695CFE] hover:bg-blue-600 text-white font- py-2 px-4 mb-4 rounded transition ease-in-out duration-500">
                    Login
                  </button>
                </Form>
              )}
              {param.signup == "signin" && (
                <Link
                  to={"/signup"}
                  className="text-blue-200 transition ease-in-out duration-500 hover:text-blue-400"
                >
                  Don't have an account?{" "}
                </Link>
              )}
            </div>
          </div>
        </div>
        {loading && <Loader />}
      </div>
    </div>
  );
};

export default Signup;
