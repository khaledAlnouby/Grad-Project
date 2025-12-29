// frontend/src/components/VideoCall.js
import React, { useEffect } from 'react';
import axios from 'axios';

const VideoCall = ({ room, user, onClose }) => {
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('/api/jitsi/token', {
          params: { user, room }  // Include user and room parameters in the request
        });

        const token = response.data.token; // Extract the JWT token from the response data

        const domain = "8x8.vc"; // Jitsi Meet domain
        const options = {
          roomName: `vpaas-magic-cookie-eadd3ab1f9204e1d8721beef17832947/${room}`, // Room name
          parentNode: document.querySelector('#jaas-container'), // HTML element to mount Jitsi iframe
          jwt: token // JWT token for authentication
        };

        // Initialize Jitsi Meet External API with the configured options
        new window.JitsiMeetExternalAPI(domain, options);
      } catch (error) {
        console.error("Error fetching the JWT token: ", error);
      }
    };

    // Call fetchToken function when component mounts or when room or user changes
    fetchToken();
  }, [room, user]); // Dependencies for useEffect hook

  // Render the VideoCall component
  return (
    <div className="jitsi-modal">
      <button className="close-button" onClick={onClose}>Close</button> {/* Close button to close the video call */}
      <div id="jaas-container" className="jaas-container" /> {/* Container for Jitsi iframe */}
    </div>
  );
};

export default VideoCall;
