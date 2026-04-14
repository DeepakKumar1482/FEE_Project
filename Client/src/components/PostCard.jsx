import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ModalPost } from "./index";
import axios from "axios";
import ImageCarousel3 from "./ImageCarousel3";
import { useUser } from "../ContextApi/UserContext";
import { useInfiniteQuery } from "@tanstack/react-query";
function PostCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalPostOpen, setIsModalPostOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const myRef = useRef(null);
  const [flag, setflag] = useState(0);
  const likeRef = useRef(null);
  const bookmarkRef = useRef(null);
  const [propdata, setpropdata] = useState({});
  const Navigate=useNavigate();
  const {userLikedPosts, setuserlikedPosts, userSavedPosts, setuserSavedPosts} = useUser();
  // const [userSavedPosts, setuserSavedPosts] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    console.log(userLikedPosts, "liked posts")
    console.log(userSavedPosts, "saved posts")

  }, [userLikedPosts, userSavedPosts]);
  useEffect(() => {
    const apiCall = async() => {
      const response = await axios.post('/api/user/getuser', {username: localStorage.getItem('username')})
      // console.log(response.data);
      if(response.data.success){
        // console.log("hi:", response.data.data.likedPosts)
        setuserlikedPosts(response.data.data.likedPosts)
        setuserSavedPosts(response.data.data.savedposts);
      }
    }
    apiCall();
    
  },[]);

  useEffect(() => {
    if (posts.length > 0) {
      const container = document.querySelector('.view-more-cls');
      console.log("view more", container);
      if (container.scrollHeight > container.clientHeight) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [isLoading]);



  const fetchPosts = async ({pageParam = 1}) => {
    try {
      const response = await axios.get(
        `/api/posts/getposts?page=${pageParam}&limit=10`
      );
      const postsData = response.data.posts;
      // console.log(postsData[0]);
      setPosts(postsData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPostApi = async({pageParam = 1}) => {
    const response = await axios.get(
      `/api/posts/getposts?page=${pageParam}&limit=10`
    );
    return response.data;
  }
  
  const loadMoreRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: fetchPostApi,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasNextPage ? allPages.length + 1 : undefined;
      }
    });

    console.log(data, "infinite query");

  const GetUserProfile = (values) => {
    return Navigate("/userprofile/"+values);
  }
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, hasNextPage, fetchNextPage]);

  const likePostFunction = async(e, postId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post('/api/posts/like-post', {postId}, {headers: {Authorization: 'Bearer '+ token}})
    // likeRef.current.classList.toggle("bxs-heart");
    // console.log("like: ", likeRef.current);
    if(response.data.success){
      console.log(response.data.message)
    }
    else{
      message.error(response.data.message)
    }
  }
  const savePostFunction = async(postId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post('/api/posts/save-post', {postId}, {headers: {Authorization: 'Bearer '+ token}})
    if(response.data.success){
      console.log(response.data.message)
    }
    else{
      message.error(response.data.message)
    }
  }
  useEffect(() => {
    if(posts.length > 0){
      setisLoading(true);
    }
  },[posts])
  const card = () => {
    return (
    <>
      {data?.pages.map((page, index) =>
      page?.posts?.map((postdata, key) => (
        <div
          key={key}
          className="flex flex-col gap-2 w-[30rem] px-5 py-8 rounded-xl justify-evenly h-screen"
        >
          <div className="flex gap-2 items-center cursor-pointer " onClick={()=>GetUserProfile(postdata.userid.username)}>
            <div>
              {/* <img src={postData.avatar} alt="" /> */}
              <i className="h-5 w-5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={postdata?.userid?.imageurl}
                  alt=""
                />
              </i>
            </div>
            <div className="flex flex-col">
              <p className="dark:text-white text-gray-800 font-semibold font-sans">
                {postdata?.userid?.name}
              </p>
              <p className="dark:text-white text-gray-800 font-semibold font-sans -mt-1">
                @ {postdata?.userid?.username}
              </p>
            </div>
          </div>{" "}
          {/* avatar username */}
          <div className={`flex h-[320px] rounded-xl justify-center bg-black`}>
            {postdata.imageUrls.length > 1 ? (
              <ImageCarousel3
                data={postdata.imageUrls}
                height={"h-[320px]"}
              />
            ) : (
              <img src={postdata.imageUrls[0]} />
            )}
          </div>{" "}
          {/* post image */}
          <div className="flex hide-scrollbar gap-2 overflow-x-scroll">
            {postdata.tech.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-1 dark:text-white bg-gray-200 text-gray-800 dark:bg-gray-700 rounded-md px-2 py-1 min-w-fit"
              >
                <div className="bg-green-600 w-2 h-2 rounded"></div>
                <p>{tech}</p>
              </div>
            ))}
          </div>{" "}
          {/* tech stack */}
          <div className="dark:text-white text-gray-800 ">
            <p className="h-[4.5rem] text-wrap break-all whitespace-normal w-full max-w-full overflow-y-hidden view-more-cls">
              hello {postdata.description}
            </p>
            {isOpen ? (
              <span
                onClick={() => {
                  document.body.style.overflowY = "hidden";
                  setIsModalPostOpen(true);
                  console.log("propdata", postdata)
                  setpropdata(postdata);
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
            {/* //TODO: Timings of posts */}
              {/* <span>{postdata.Time.time}</span>{" "}
              <span>{postdata.Time.date}</span> */}
            </p>
            <Link
              to={postdata.githubRepo}
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
                setpropdata(postdata);
              }}
              className="bx bx-message-rounded cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]"
            ></i>
            <i
              className={`bx bx-heart cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85] ${userLikedPosts?.includes(postdata._id) ? "bxs-heart" : ""}`}
              ref={likeRef}
              onClick={(e) => {
                  e.currentTarget.classList.toggle("bxs-heart");
                  likePostFunction(e, postdata._id)
                }}
            ></i>
            <i
              className={`bx bx-bookmark cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85] ${userSavedPosts?.includes(postdata._id) ? "bxs-bookmark": ""}`}
              onClick={(e) => {
                e.currentTarget.classList.toggle("bxs-bookmark");
                savePostFunction(postdata._id);
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
        ))
      )}
      <div ref={loadMoreRef} className="load-more">
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more posts'}
      </div>
    </>
    )
  };

  return card();
}

export default PostCard;
