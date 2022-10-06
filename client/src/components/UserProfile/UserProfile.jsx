import React, { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState, userIdState } from '../userAtoms.js';
import axios from 'axios';
import io from 'socket.io-client';


const socket = io();

const UserProfile = () => {
  const [userInfo, setUserinfo] = useRecoilState(userState);
  const id = useRecoilValue(userIdState)
  const hiddenFileInput = React.useRef(null);
  const [img, setImg] = useState(userInfo.img);
  console.log('User image: ', img)
  var showImg = userInfo.img || img || '/assets/Craft.png'

  const handleFileChange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    let fileSize = file.size / 1024;
    if (fileSize > 64) {
    alert('File size exceeds 64 KB');
    return;
    }
    // $(file).val(''); //for clearing with Jquery
    reader.onloadend = function() {
      setImg(reader.result)
      axios.put('/updatePhoto', { img: reader.result, userId: id }).catch(() => {
        alert('Picture was not updated correctly, please try again');
      })
    }
    reader.readAsDataURL(file);
  }

  //refresh Token function to get new access token every 10 minutes
  const refreshToken = () => {
    axios.post('http://ec2-3-128-156-90.us-east-2.compute.amazonaws.com:8087/refresh', {token: localStorage.getItem('token')})
      .then((data) => {
        console.log(data.data);
        axios.defaults.headers.common['Authorization'] = `BEARER ${data.data.accessToken}`;
        localStorage.setItem('accessToken', data.data.accessToken);
        setTimeout(() => {
          refreshToken();
        }, 598000);
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //start refreshToken counter
  useEffect(() => {
    setTimeout(() => {
      refreshToken();
    }, 2000); //change this back after testing
  }, [])

  return (
    <div className='user-profile-container'>
      <input type='file' accept=".jpg, .jpeg, .png" ref={hiddenFileInput} style={{display: 'none'}} onChange={handleFileChange}/>
      <div>
      <img className='user-profile-container-image' src={showImg} onClick={() => {hiddenFileInput.current.click()}} style={{height: '50px', width: '50px', borderRadius: '50%'}}></img>
        {/* {`${userInfo.firstname} ${userInfo.lastname}  (${userInfo.username})`} */}
        </div>
    </div>
  )
}

export default UserProfile;