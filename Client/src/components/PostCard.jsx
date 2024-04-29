import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ModalPost } from "./index";
import axios from "axios";
import { ImageCarousel } from "./index";
import ImageCarousel3 from "./ImageCarousel3";
function PostCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalPostOpen, setIsModalPostOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const myRef = useRef(null);
  const [flag, setflag] = useState(0);
  const [propdata, setpropdata] = useState({});
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const container = myRef.current;
      console.log("view more", container);
      if (container.scrollHeight > container.clientHeight) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [posts]);
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/posts/getposts",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const postsData = response.data.posts;
      console.log(postsData);
      setPosts(postsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (myRef.current) {
      const container = myRef.current;
      if (container.scrollHeight > container.clientHeight) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [posts]);

  const card = () => {
    return posts.map((postdata, key) => (
      <div
        key={key}
        className="flex flex-col gap-2 w-[30rem] px-5 py-8 rounded-xl justify-evenly h-screen"
      >
        <div className="flex gap-2 items-center ">
          <div>
            {/* <img src={postData.avatar} alt="" /> */}
            <i className="h-5 w-5">
              <img
                className="h-10 w-10 rounded-full"
                src={postdata.post[0].avatar}
                alt=""
              />
            </i>
          </div>
          <div className="flex flex-col">
            <p className="dark:text-white text-gray-800 font-semibold font-sans">
              {postdata.post[0].name}
            </p>
            <p className="dark:text-white text-gray-800 font-semibold font-sans -mt-1">
              @ {postdata.post[0].username}
            </p>
          </div>
        </div>{" "}
        {/* avatar username */}
        <div className={`flex h-[320px] rounded-xl justify-center bg-black`}>
          {postdata.post[0].imageurls.length > 1 ? <ImageCarousel3
            data={postdata.post[0].imageurls}
            height={"h-[320px]"}
          /> : <img src={postdata.post[0].imageurls[0]}/>}
          
        </div>{" "}
        {/* post image */}
        <div className="flex hide-scrollbar gap-2 overflow-x-scroll">
          {postdata.post[0].tech.map((tech) => (
            <div
              key={tech}
              className="flex items-center gap-1 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 min-w-fit"
            >
              <div className="bg-green-600 w-2 h-2 rounded"></div>
              <p>{tech}</p>
            </div>
          ))}
        </div>{" "}
        {/* tech stack */}
        <div className="dark:text-white text-gray-800 ">
          <p ref={myRef} className="h-[4.5rem] overflow-y-hidden">
            {postdata.post[0].description}
          </p>
          {isOpen ? (
            <span
              onClick={() => {
                document.body.style.overflowY = "hidden";
                setIsModalPostOpen(true);
                setpropdata(postdata.post[0]);
              }}
              className="cursor-pointer text-blue-400 hover:text-blue-500 active:text-indigo-600"
            >
              view more...
            </span>
          ) : null}
        </div>{" "}
        {/* caption */}
        <div className="flex items-center justify-between pr-0">
          <p className="dark:text-white text-gray-800">
            <span>{postdata.post[0].Time.time}</span>{" "}
            <span>{postdata.post[0].Time.date}</span>
          </p>
          <Link
            to={postdata.post[0].githubRepo}
            className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-700 rounded-lg px-2 py-1 text-white"
          >
            <i className="bx bxl-github"></i>
            <span className="font-sans font-medium">GitHub Repo</span>
          </Link>
        </div>{" "}
        {/* time and github repo button */}
        <div className="flex text-3xl dark:text-white text-gray-800 gap-5">
          <i
            onClick={() => {
              document.body.style.overflowY = "hidden";
              setIsModalPostOpen(true);
              setpropdata(postdata.post[0]);
            }}
            className="bx bx-message-rounded cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]"
          ></i>
          <i
            className="bx bx-heart cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]"
            onClick={(e) => {
              e.currentTarget.classList.toggle("bxs-heart");
            }}
          ></i>
          <i
            className="bx bx-bookmark cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]"
            onClick={(e) => {
              e.currentTarget.classList.toggle("bxs-bookmark");
            }}
          ></i>
        </div>{" "}
        {/* comments like and bookmark button */}
        <hr className="dark:bg-white bg-gray-700 h-[1.5px]" />
        {isModalPostOpen && (
          <ModalPost
            data={propdata}
            onClose={() => {
              document.body.style.overflowY = "visible";
              setIsModalPostOpen(false);
            }}
          />
        )}
      </div>
    ));
  };

  return card();
}

export default PostCard;
