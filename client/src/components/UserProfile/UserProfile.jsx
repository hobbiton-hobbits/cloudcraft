import React, { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { usernameState } from '../userAtoms.js';
import axios from 'axios';

const UserProfile = () => {
  // const userInfo = useRecoilValue(usernameState);
  const [showImgModal, setShowImgModal] = useState(false);
  const [userInfo, setUserinfo] = useState({
    username: 'Tester 1',
    img: "https://as1.ftcdn.net/v2/jpg/03/03/51/54/1000_F_303515472_Kr9lY8FlfqGj8A8UkXwRDPXH5jctp4nz.jpg"
  })

  const hiddenFileInput = React.useRef(null);

  const updateImage = (e) => {
    let file = document.querySelector('input[type=file]').files[0];
    let url = URL.createObjectURL(file);
    var temp = Object.assign({}, userInfo);
    temp.img = url;
    setUserinfo(temp)
    setShowImgModal(false);
  }

  //refresh Token function to get new access token every 10 minutes
  const refreshToken = () => {
    axios.get('http://ec2-3-128-156-90.us-east-2.compute.amazonaws.com:8087/refresh')
      .then((data) => {
        axios.defaults.headers.common['Authorization'] = `BEARER ${data.data.accessToken}`;
        setTimeout(() => {
          refreshToken();
        }, 598000);
      })
  };

  //start refreshToken counter
  useEffect(() => {
    setTimeout(() => {
      refreshToken();
    }, 2000); //change this back after testing
  }, [])

  return (
    <div className='user-profile-container'>
      <input type='file' accept=".jpg, .jpeg, .png" ref={hiddenFileInput} style={{display: 'none'}} onChange={updateImage}/>
      <img className='user-profile-container-image' src={userInfo.img} onClick={() => {hiddenFileInput.current.click()}} style={{height: '50px', width: '50px', borderRadius: '50%'}}></img>
      <div>{userInfo.username}</div>
    </div>
  )
}

export default UserProfile;