import React, {useRef, useState} from 'react'
import {FullPreview} from "./index"
import myImg from "../images/Screenshot 2024-03-29 112144.png";
import myImg1 from "../images/free-photo-of-red-cherries-in-bowl-and-basket.jpeg";

function ImageCarousel({postImages, width, height}) {
  console.log("This is from props -> ",postImages);
  // const [isFullPreview, setIsFullPreview] = useState(false);
  // const imgRef = useRef(null);
  // const [images, setImages] = useState(postImages);
  // if(images){
  //   console.log("yes");
  // }
  // const showFullPreview = (e) => {
  //   if(allowFullPreview == true){
  //     console.log("clicked");
  //     setIsFullPreview(true);
  //   }
  // }
  console.log(postImages);

  return (
    <div data-hs-carousel='{
        "loadingClasses": "opacity-0"
      }' className={`relative ${width} ${height}`}>
      <div className={`hs-carousel relative overflow-hidden w-full ${height} rounded-lg`}>
        <div className="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
            {postImages.map((postImage, index) => (
                <div key={index} className={`hs-carousel-slide ${height}`}>
                    <div className={`flex justify-center ${height} bg-gray-100 p-6 dark:bg-neutral-900`}>
                        <div className={`self-center flex ${height} justify-center text-4xl text-gray-800 transition duration-700 dark:text-white`}>
                            <img className='' src={postImage} alt="" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      <div className='absolute inset-y-0 start-0 flex items-center bg-transparent'>
        <button type="button" className="hs-carousel-prev hs-carousel:disabled:opacity-50 disabled:pointer-events-none h-fit text-gray-800 hover:bg-gray-800/10 dark:text-white dark:hover:bg-white/10 px-1 py-1 rounded-full">
          <span className="text-2xl" aria-hidden="true">
            <svg className="flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </span>
          <span className="sr-only">Previous</span>
        </button>
      </div>
      <div className='absolute inset-y-0 end-0 flex items-center'>
        <button type="button" className="hs-carousel-next hs-carousel:disabled:opacity-50 disabled:pointer-events-none text-gray-800 hover:bg-gray-800/10 h-fit px-1 py-1 rounded-full dark:text-white dark:hover:bg-white/10">
          <span className="sr-only">Next</span>
          <span className="text-2xl" aria-hidden="true">
            <svg className="flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </span>
        </button>
      </div>
    
      <div className="hs-carousel-pagination flex justify-center absolute bottom-3 start-0 end-0 space-x-2">
            {postImages.map((postImage, index) => (
                <span key={index} className="hs-carousel-active:bg-blue-700 hs-carousel-active:border-blue-700 size-3 border border-gray-400 rounded-full cursor-pointer dark:border-neutral-600 dark:hs-carousel-active:bg-blue-500 dark:hs-carousel-active:border-blue-500"></span>    
            ))}
      </div>
      {/* {isFullPreview && <FullPreview postImages_2={postImages} onClose={() => {
        setIsFullPreview(false);
      }}/>} */}
    </div>
  )
}

export default ImageCarousel