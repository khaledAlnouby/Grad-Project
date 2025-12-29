// frontend/src/pages/VideoCallPage.js
import React from 'react';
import VideoCall from '../components/VideoCall';

const VideoCallPage = ({ room, user }) => {
  return (
    <div style={{ height: "100vh" }}>
      <VideoCall room={room} user={user} />
    </div>
  );
};

export default VideoCallPage;
