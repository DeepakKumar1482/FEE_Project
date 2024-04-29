import React from 'react'
import {Carousel} from "antd"
// import "./antd/dist/antd.js"

function PrevArrow(props){
    const { className, style, onClick } = props;
    return(
        <div className='absolute inset-0 w-fit flex items-center justify-start z-40'>
            <button onClick={onClick} className='py-1 px-2 rounded-full text-2xl bg-white/50 backdrop-blur-sm'>
                <i class='bx bx-chevron-left'></i>
            </button>
        </div>
    )
}
function NextArrow(props){
    const { className, style, onClick } = props;
    return(
        <div className='absolute inset-0 flex items-center justify-end'>
            <button onClick={onClick} className='py-1 px-2 rounded-full text-2xl bg-white/50 backdrop-blur-sm'>
                <i class='bx bx-chevron-right'></i>
            </button>
        </div>
    )
}

function ImageCarousel3({postImagesArray}) {

  return (
    <div className='w-full relative'>
        <Carousel arrows prevArrow={<PrevArrow/>} nextArrow={<NextArrow/>} className='h-[40rem]'>
            {postImagesArray.map((postImage, index) => (
                <div className="flex justify-center items-center" key={index}>
                    <div className="w-full h-[40rem]">
                        <img className="h-full w-full object-contain" src={postImage} alt="" />
                    </div>
                </div>
            ))}
        </Carousel>
    </div>
  )
}

export default ImageCarousel3