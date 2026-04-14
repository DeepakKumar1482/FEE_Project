// import axios from 'axios';
// import { useState } from 'react';
// import { message } from 'antd';

// const Profile = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (event) => {
//     setSelectedImage(event.target.files[0]);
//   };

//   const uploadImage = async () => {
//     if (!selectedImage) {
//       message.error("Please select an image first.");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("image", selectedImage);

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/user/upload", // Your API endpoint
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.status === 200) {
//         message.success("Image uploaded successfully");
//         // You can handle additional actions here (e.g., updating state, redirecting)
//       } else {
//         message.error(`Failed to upload image. Status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       message.error("Failed to upload image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         onChange={handleFileChange}
//       />
//       <button onClick={uploadImage} disabled={loading}>
//         {loading ? "Uploading..." : "Upload Image"}
//       </button>
//     </div>
//   );
// };

// export default Profile;
