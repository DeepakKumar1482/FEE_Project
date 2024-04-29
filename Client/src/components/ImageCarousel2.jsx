import React from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ImageCarousel2({postImagesArray}) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      };
    return (
      <div className="w-full px-5 bg-blue-700">
        <Slider className="bg-green-600 h-[40rem]" {...settings}>
          {postImagesArray.map((postImage, index) => (
            <div className="bg-cyan-500" key={index}>
              <div className="self-center h-[320px]">
                <img className="" src={postImage} alt="" />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
}

export default ImageCarousel2