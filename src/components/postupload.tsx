'use client';

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import axios from 'axios';

const PostUpload: React.FC = () => {
  const [resource, setResource] = useState<any>(null); // Track uploaded resource

  // Handle the successful upload result
  const handleUploadSuccess = (result: any, { widget }: any) => {
    setResource(result?.info);  // Set the uploaded resource info like public_id, secure_url, etc
    console.log('Uploaded Resource:', result?.info);  // Log the uploaded resource
     axios.post('/api/uploadposts',{ email: localStorage.getItem('email'), link: result?.info.secure_url }).then((res) => console.log(res.data)).catch((err) => console.error(err));
  };

  // Handle closing the widget after upload is complete
  const handleQueueEnd = (result: any, { widget }: any) => {
    widget.close();  // Close the widget after the queue ends
  };

  return (
    <div className="flex flex-col items-center">
      <CldUploadWidget
        uploadPreset="xmevcpfa" // Replace with your Cloudinary upload preset
        onSuccess={handleUploadSuccess}
        onQueuesEnd={handleQueueEnd} // Close the widget when upload is done
      >
        {({ open }) => {
          const handleOnClick = () => {
            setResource(null);  // Reset the resource before opening the widget
            open();  // Open the Cloudinary widget
          };
          
          return (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleOnClick}
            >
              Upload Post
            </button>
          );
        }}
      </CldUploadWidget>

      {resource && resource.secure_url && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Uploaded Post:</h3>
          <img
            src={resource.secure_url}
            alt="Uploaded"
            className="mt-2 w-40 h-40 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default PostUpload;