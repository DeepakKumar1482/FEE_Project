import { useEffect, useState } from "react";
import { app } from "../Firebase/config.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { message } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import Google from "../assets/Google.webp";
import Loader from "../components/Loader/loader.jsx";
import axios from "axios";
import { ParticlesComponent } from "../components";
import { TextLoader } from "./";
import OTPPopup from "../components/OtpPopup";
// import ForgotPasswordModal from "./ForgotPasswordModal";
import  ForgotPasswordModal  from "../components/ForgotPasswordPopup.jsx";
import { useUser } from "../ContextApi/UserContext.jsx";

const Signup = () => {
  const param = useParams();
  const [loading, setLoading] = useState(false);
  const [isTextLoader, setIsTextLoader] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const googleAuthProvider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const navigate = useNavigate();
  const { setUserData } = useUser();

  // Function to verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/user/verifyotp", {
        email,
        otpValue,
      });
      if (res.data.success) {
        message.success("OTP verified. Signup successful!");
        setUserData({ email, password });
        navigate("/profile");
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      message.error("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const SignupWithMail = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/user/register", {
        email: email,
        password: password,
      });
      if (res.data.success) {
        message.success("Registered successfully. Sending OTP...");
        setOtpSent(true);
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      message.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        const user = result.user;
        const creationTime = new Date(user.metadata.creationTime).getTime();
        const lastLoginTime = new Date(user.metadata.lastSignInTime).getTime();

        if (creationTime === lastLoginTime) {
          message.success("Signed up successfully");
          navigate("/profile");
        } else {
          message.error("Already have an account");
          navigate("/signin");
        }
      })
      .catch((error) => {
        message.error("An error occurred during Google sign-in. Please try again.");
      });
  };

  const signin = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/user/logincheck",
        { ...values }
      );
      if (res.data.success) {
        message.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", values.username);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextLoader(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <ParticlesComponent />
      {isTextLoader ? (
        <TextLoader />
      ) : (
        <div className="h-screen w-screen flex flex-col bg-[#242526] justify-center items-center text-center">
          <div id="headingText" className="z-10">
            <h1 className="text-4xl bg-white/10 backdrop-blur-sm rounded-lg p-2 text-[#695CFE] font-[550] mb-12 mt-10">
              CODEBUDDY
            </h1>
          </div>
          <div id="loginbox" className="flex justify-center items-center w-full h-full mb-10">
            <div className="w-fit flex justify-center backdrop-blur-sm bg-black/30 h-full">
              <div className="w-96 h-auto pb-5 px-10 shadow-lg rounded-md border border-gray-300">
                {param.signup === "signup" ? (
                  <div className="flex flex-col justify-center items-center gap-6 h-full">
                    <form onSubmit={SignupWithMail} className="pt-10 w-72">
                      <div className="mb-4">
                        <input
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          name="email"
                          required
                          className="bg-transparent text-white h-12 text-lg placeholder:text-gray-400 w-full mt-2 p-2 rounded-md"
                          placeholder="Email"
                        />
                      </div>

                      <div className="mb-4">
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          name="password"
                          required
                          className="bg-transparent text-white h-12 text-lg placeholder:text-gray-400 w-full mt-2 p-2 rounded-md"
                          placeholder="Password"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 flex items-center justify-center bg-[#695CFE] hover:bg-[#574cd0] text-white text-base font-semibold mb-4 rounded-lg"
                        disabled={loading}
                      >
                        {loading ? "Signing Up..." : "Sign Up"}
                      </button>
                    </form>

                    <div className="w-60 h-5 border-b-2 rounded-md border-[#484848]"></div>
                    <button
                      onClick={signupWithGoogle}
                      className="w-full h-11 flex items-center justify-center bg-[#242526] border border-[#696969] text-[#696969] text-base font-semibold py-2 gap-2 px-4 rounded-lg"
                    >
                      Sign Up with Google
                      <img src={Google} alt="Google Logo" className="h-6" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-6 h-full">
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        signin({ username: email, password: password });
                      }}
                      className="pt-10 w-72"
                    >
                      <div className="mb-4">
                        <input
                          onChange={(e) => setEmail(e.target.value)}
                          type="text"
                          name="username"
                          required
                          className="bg-transparent text-white h-12 text-lg placeholder:text-gray-400 w-full mt-2 p-2 rounded-md"
                          placeholder="Username/Email"
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          name="password"
                          required
                          className="bg-transparent text-white h-12 text-lg placeholder:text-gray-400 w-full mt-2 p-2 rounded-md"
                          placeholder="Password"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full h-11 flex items-center justify-center bg-[#695CFE] hover:bg-[#574cd0] text-white text-base font-semibold mb-4 rounded-lg"
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="w-full text-[#c7c7c7] hover:text-white mb-4 text-sm"
                      >
                        Forgot Password?
                      </button>
                    </form>
                    <div className="w-60 h-5 border-b-2 rounded-md border-[#484848]"></div>
                    <Link to="/signup" className="text-[#c7c7c7] hover:text-white">
                      Don't have an account? Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Popup for Signup */}
      <OTPPopup
        visible={otpSent}
        onClose={() => setOtpSent(false)}
        otpValue={otpValue}
        setOtpValue={setOtpValue}
        onVerify={verifyOtp}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default Signup;