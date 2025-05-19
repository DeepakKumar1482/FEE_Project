import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'; 
const SearchComponent = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        studyingAt: '',
        githubid: '',
        username: '',
        email: '',
        techStack: '',
    });
    const [results, setResults] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    };

    const handleSearch = async () => {
        try {
            // Prepare query string for filtering
            const query = new URLSearchParams(
                Object.entries(searchParams).filter(([_, value]) => value.trim() !== "")
            ).toString();
            if(query === '') {
                message.info("Please enter a search term");
                return;
            }
            const response = await axios.get(`http://localhost:8080/api/user/getAllusers?${query}`);
            setResults(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };
    const RenderToUserProfile = (values) => {
        navigate(`/userprofile/${values}`);
    }
    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl  mb-4 text-center text-black">Search Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    name="studyingAt"
                    placeholder="University"
                    value={searchParams.studyingAt}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="githubid"
                    placeholder="GitHub ID"
                    value={searchParams.githubid}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={searchParams.username}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={searchParams.email}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="techStack"
                    placeholder="Tech Stack (comma-separated)"
                    value={searchParams.techStack}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-600 transition duration-200"
                >
                    Search
                </button>
            </div>
            <div className=''>
                {/* <h3 className="text-2xl font-semibold mb-2">Results:</h3> */}
                {results.length > 0 ? (
                    <ul className=" shadow-md rounded-lg p-4 overflow-auto flex flex-col gap-y-5">
                        {results.map((profile) => (
                            <li key={profile._id} className="border-b bg-gray-100 rounded-md h-16 flex items-center  border-gray-200 py-2 px-5">
                                <p onClick={()=>RenderToUserProfile(profile.username)} className="text-lg font-medium flex gap-x-4 hover:cursor-pointer hover:text-blue-500 text-black"> <img className='h-8 w-8 rounded-full border-2 border-white' src={profile.imageurl} alt="avatar" /> {profile.username}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No results found</p>
                )}
            </div>
        </div>
    );
};

export default SearchComponent;