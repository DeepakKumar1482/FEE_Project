import React, { useState, useEffect } from "react";
import axios from "axios";
import {message} from "antd";
import PostCard from './PostCard.jsx'
import { useParams } from "react-router-dom";
import Loader from "./Loader/loader.jsx";
import Saved from "../pages/Saved.jsx";
import ModalPost from "./ModalPost.jsx";
const UserProfile = () => {
  const [userData, setUserData] = useState(null); // Start with `null` to handle loading state
  const [currUser, setCurrUser] = useState(localStorage.getItem("username")); // Retrieve `username` from localStorage
  const [techStack, setTechStack] = useState("");
  const [techStackLimit, setTechStackLimit] = useState(3); // Initially show only 3 items
  const [languageStats, setLanguageStats] = useState({}); // To hold aggregated language data
  const[about,setAbout]=useState("");
  const[Edit,setEdit]=useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const param=useParams();
  const [isModalPostOpen, setIsModalPostOpen] = useState(false);
  const[loading,setLoading]=useState(false);
  const[propdata,setPropData]=useState({});
  const [savedPosts, setSavedPosts] = useState([]); 
  const handleSplitTechStack = () => {
    const techStackArray = techStack.split(",").map((item) => item.trim()); // Split by ',' and trim whitespace
    return techStackArray;
  };
  // console.log("This is about data -> ",about);
  const TechArray = handleSplitTechStack(); // Call the function to split and trim the tech stack

  const toggleTechStackLimit = () => {
    // Toggle between showing all items and limited items
    setTechStackLimit(techStackLimit === 3 ? TechArray.length : 3);
  };

  const SubmitData=async()=>{
    try{
      if(currUser===userData.data.username){
        console.log(currUser,userData.data.email);
      setEdit(!Edit);

      }
      if(Edit){
      const res=await axios.post("http://localhost:8080/api/user/updateabout",{username:currUser,about:about});
      if(res.data.success){
        // setIsSaved(true);
        fetchUserDetails();
        message.success("Data Updated Successfully");
      }
    }
    }catch(e){
      console.log(e);
    }
  }

  const fetchUserDetails = async () => {
    if (!currUser) {
      console.error("Username is not available in localStorage.");
      return;
    }

    const user = { username: param };
    try {
      setLoading(true);
      console.log("This is user data -> ",user.username.username);
      const res = await axios.post("http://localhost:8080/api/user/getuser", {username:user.username.username});
      console.log("This is user profile data -> ",res.data)
      setUserData(res.data);
      setTechStack(res.data.data.techStack[0]);
      console.log("This is use data -->",res.data);
      // Fetch GitHub data based on GitHub ID
      await fetchGitHubData(res.data.data.githubid);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching user details:", err);
    }
  };

  const getPosts=async()=>{
    try{
      const user = param.username;
      const res=await axios.get(`http://localhost:8080/api/posts/getUserProfileposts?username=${user}`);
      if(res.data.success){
        console.log("user profile data -> ",res.data);
        setSavedPosts(res.data.UserPosts);
      }
    }catch(e){
      console.log(e);
    }
  }
  useEffect(() => { 
    getPosts();
    fetchUserDetails();
  }, [param]);

  const fetchGitHubData = async (githubId) => {
    try {
      const cachedData = JSON.parse(localStorage.getItem("GithubTech")) || {};
      const lastFetched = cachedData.timestamp || 0;
      const currentTime = new Date().getTime();

      // Check if the last fetched data is older than 24 hours
      if (currentTime - lastFetched < 24 * 60 * 60 * 1000 && cachedData.data) {
        console.log("Using cached GitHub data");
        setLanguageStats(cachedData.data);
        return;
      }

      console.log("Fetching data from GitHub API...");
      const response = await axios.get(`https://api.github.com/users/${githubId}/repos`);
      const repos = response.data;

      // Aggregate languages used in projects
      const languageCount = repos.reduce((acc, repo) => {
        if (repo.language) {
          acc[repo.language] = (acc[repo.language] || 0) + 1; // Count occurrences of each language
        }
        return acc;
      }, {});

      // Calculate percentages
      const totalRepos = repos.length;
      const percentages = {};
      for (const [language, count] of Object.entries(languageCount)) {
        percentages[language] = ((count / totalRepos) * 100).toFixed(2); // Calculate percentage
      }

      // Save data in localStorage with a timestamp
      localStorage.setItem(
        "GithubTech",
        JSON.stringify({ data: percentages, timestamp: currentTime })
      );

      setLanguageStats(percentages); // Set aggregated language stats
    } catch (err) {
      console.error("Error fetching GitHub data:", err);
    }
  };

  const AddConnection=async()=>{
    try{
      const res=await axios.post("http://localhost:8080/api/user/addconnection",{sender:currUser,receiver:param});
      if(res.data.success){
        message.success("Connection request sent Successfully");
      }else{
        message.error(res.data.message);
      }
    }catch(e){
      console.log(e);
  }
}

  if (!userData) {
    return <Loader/>; // Show a loading state while data is being fetched
  }
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen overflow-y-scroll p-4 sm:p-8">
      {/* Profile Background Image */}
      {/* <div
        className="relative w-full h-48 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
        style={{ backgroundImage: "url('https://via.placeholder.com/1200x300')" }}
      >
        <button className="absolute bottom-2 right-2 bg-gray-200 dark:bg-gray-800 text-sm px-4 py-1 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-700">
          Change Cover
        </button>
      </div> */}

      {/* Main Content */}
      <div className="flex flex-col space-y-6 mt-6">
        <div className="flex justify-end">
          <p onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }} 
            className="bg-[#695CFE] cursor-pointer inline p-2 rounded-lg">Logout</p>
        </div>
        {/* Profile and Intro Section */}
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Profile Section */}
          <div 
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100')"
            }} 
            className="flex-1 bg-cover bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div 
              style={{
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                backgroundColor: "rgba(17, 25, 40, 0.75)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.125)"
              }} 
              className="w-full  flex p-5 px-10 justify-between text-white h-full"
            >
              <div className="flex-col  w-full  space-y-14 ">
              <div className="flex items-center space-x-6">
                {/* Profile Picture */}
                <div className="w-24 h-24 rounded-full bg-cover overflow-hidden border-4 border-white dark:border-gray-800">
                  <img
                    src={userData?.data?.imageurl || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Profile Name & Info */}
                <div>
                  <h1 className="text-2xl font-semibold">{userData?.data?.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400">@{userData?.data?.username}</p>
                  <h1>{userData.data.connections.length} <span>Connections</span></h1>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                  Message
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600" onClick={AddConnection}>
                  + Connect
                </button>
              </div>
              </div>
              <div className="text-white  w-full justify-center ">
                <div className="w-full">
            {Object.keys(languageStats).length > 0 && (
              <>
                <h2 className="text-lg flex  items-center gap-2 font-semibold mt-4">Language Usage <span className="w-6 h-6"><img className="w-5 h-5" src="https://cdn-icons-png.freepik.com/512/7641/7641727.png" alt="" /></span></h2>
                <ul className="mt-2 space-y-2">
                  {Object.entries(languageStats).map(([language, percentage]) => (
                    <li key={language} className="flex items-center">
                      <span 
                        className={`w-full h-[10px] rounded ${getColorByLanguage(language)}`} 
                        style={{ width: `${percentage}%` }}
                      ></span>
                      <span className="ml-2">{language}: {percentage}%</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            </div>
            </div>
            </div>
            
          </div>

          {/* Intro Section */}
          <div
           style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100')"
          }} 
           className="flex-1 bg-cover bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ">
            <div
            style={{
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              backgroundColor: "rgba(17, 25, 40, 0.75)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.125)"
            }} 
            className="w-full  flex p-5 px-10 justify-between text-white h-full"
            > 
            {/* <h2 className="text-lg font-semibold">Intro</h2> */}
            <ul className="mt-4 space-y-4">
              <li>
                <h1 className="text-lg font-semibold">College/University:{" "} <span>{userData?.data?.studyingAt}</span></h1>{" "}
              </li>
              <li className="">
                <h1 className="text-lg font-semibold flex justify-center items-center  gap-2">Tech Stack:
                 <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    {TechArray.slice(0, techStackLimit).map((tech) => (
                    <div key={tech} className="flex items-center gap-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md px-2 py-1">
                      <div className="bg-green-600 w-2 h-2 rounded-full"></div>
                      <p>{tech}</p>
                    </div>
                  ))}
                </div>
                {TechArray.length > 3 && (
                  <button
                    className="text-blue-500 mt-2 hover:underline"
                    onClick={toggleTechStackLimit}
                  >
                    {techStackLimit === 3 ? "View More" : "View Less"}
                  </button>
                )}
                {/* </span> */}
                </h1>
              </li>
              <li>
                <h1 className="text-lg font-semibold">Email:{" "} {userData?.data?.email}</h1>{" "}
                
              </li>
              <li>
                <h1 className="text-lg font-semibold">GithubId:{" "}{userData?.data?.githubid}</h1>{" "}
                
              </li>
            </ul>

            {/* Language Stats Section */}
            
          </div>
          </div>
        </div>

        {/* About Section */}
        <div
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100')"
        }} 
         className="bg-white bg-cover p-10 dark:bg-gray-800 rounded-lg shadow-lg p=6">
          <div
          style={{
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            backgroundColor: "rgba(17, 25, 40, 0.75)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.125)"
          }}
          className="text-white w-full p-5 px-10 justify-between h-full" 
          >
          <h2 className="text-lg font-semibold m-2">About</h2>
          <div className="">
          <p>
          {!Edit ? (
  <h1>{userData?.data?.about}</h1> // Display the current 'about' text
) : (
  <input
    className="w-full h-14 rounded-md text-black"
    type="text"
    value={about} // Bind input value to the 'about' state
    onChange={(e) => setAbout(e.target.value)} // Update the 'about' state when the user types
    placeholder="Edit your about info..." // Optional: Add a placeholder
  />
)}


            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 mt-5" 
            
            onClick={()=>SubmitData()}>
              {Edit?"Save":"Edit"}
            </button>
          </p>
          </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* <Saved/> */}
        <>
          <div className="flex flex-col items-center gap-5 py-5 px-3 h-full w-full">
                  <h1 className="text-4xl dark:text-white text-gray-800">
                      All posts
                  </h1>
                  <div className="flex flex-col gap w-full h-full ">
                      <div className="flex flex-wrap w-full h-full px-20 relative">
                          {savedPosts.map((savedPost, index) => (
                              <div
                                  key={index}
                                  className="w-1/3 border-[3px] h-60 dark:border-black border-white cursor-pointer hover:opacity-75 active:opacity-60 bg-green-500"
                                  onClick={() => {
                                      setPropData(savedPost);
                                      setIsModalPostOpen(true);
                                  }}
                              >
                                  <img
                                      src={savedPost.imageUrls[0]}
                                      className="w-full h-full object-cover bg-gray-200 dark:bg-white"
                                      alt=""
                                  />
                              </div>
                          ))}
                      </div>
                  </div>
          </div>
          {isModalPostOpen && (
              <ModalPost
                  data={propdata}
                  onClose={() => {
                  document.body.style.overflowY = "visible";
                  setIsModalPostOpen(false);
                  }}
              />
          )}
        </>
        </div>
      </div>
    </div>
  );
};

// Function to get color based on programming language
const getColorByLanguage = (language) => {
  switch (language.toLowerCase()) {
    case 'javascript':
      return 'bg-yellow-500';
    case 'python':
      return 'bg-blue-500';
    case 'java':
      return 'bg-red-500';
    case 'c#':
      return 'bg-purple-500';
    case 'ruby':
      return 'bg-pink-500';
    default:
      return 'bg-gray-300'; // Default color for unknown languages
  }
};

export default UserProfile;


