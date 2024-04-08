import { Form, Input, Select, Button, message } from 'antd';
import { useState } from 'react';
const { Option } = Select;
// import axios from 'axios';

const Profile = () => {
  return(
    <div className='h-screen w-screen bg-gray-400 flex justify-center items-center'>
    <Form className=''>
      <Form.Item name='name' className='w-1/2'>
        <Input placeholder='Name' />
      </Form.Item>
      <Form.Item name='username' className='w-1/2'>
        <Input placeholder='Username' />
      </Form.Item>
      <Form.Item name='studyingAt' className='w-1/2'>
        <Input placeholder='Studying At' />
      </Form.Item>
      <Form.Item name='techStack' className='w-1/2'>
        <Select mode='multiple' className='w-full'>
          <Option value='React'>React</Option>
          <Option value='Vue'>Vue</Option>
          <Option value='Angular'>Angular</Option>
          <Option value='Node'>Node</Option>
          <Option value='Express'>Express</Option>
          <Option value='MongoDB'>MongoDB</Option>
          <Option value='MySQL'>MySQL</Option>
          <Option value='Firebase'>Firebase</Option>
          <Option value='Docker'>Docker</Option>
          <Option value='Kubernetes'>Kubernetes</Option>
        </Select>
      </Form.Item>
    </Form>
  </div>
  )
};

export default Profile;
{/* <Form.Item label='Tech Stack' name='techStack' className='mb-4' rules={[{ required: true, message: 'Please select your tech stack!' }]}>
<Select mode='multiple' className='w-full'>
  <Option value='React'>React</Option>
  <Option value='Vue'>Vue</Option>
  <Option value='Angular'>Angular</Option>
  <Option value='Node'>Node</Option>
  <Option value='Express'>Express</Option>
  <Option value='MongoDB'>MongoDB</Option>
  <Option value='MySQL'>MySQL</Option>
  <Option value='Firebase'>Firebase</Option>
  <Option value='Docker'>Docker</Option>
  <Option value='Kubernetes'>Kubernetes</Option>
</Select>
</Form.Item> */}