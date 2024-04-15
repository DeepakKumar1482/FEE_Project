import { RotatingTriangles } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className='absolute inset-0 flex justify-center dark:bg-black bg-white/50 opacity-80 items-center text-4xl '>   
      <div className='z-50'>
        <RotatingTriangles
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
        />
      </div>
    </div>
  )
}

export default Loader