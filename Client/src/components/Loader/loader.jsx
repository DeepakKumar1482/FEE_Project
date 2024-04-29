import { RotatingTriangles } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className='absolute inset-0 flex justify-center bg-black opacity-80 items-center text-4xl '>   
      <div className='z-50'>
        {/* <RotatingTriangles
          visible={true}
          height={80}
          width={80}
          color="#4fa94d"
          ariaLabel="rotating-triangles-loading"
          wrapperStyle={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          wrapperClass=""
        /> */}
        <iframe className='w-52 h-52' src="https://lottie.host/embed/4e930323-a2a9-4e58-88bc-c2e661545705/elljudOqAm.json"></iframe>
      </div>
    </div>
  )
}

export default Loader