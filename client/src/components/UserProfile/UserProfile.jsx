import React, { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState, userIdState } from '../userAtoms.js';
import axios from 'axios';

const UserProfile = () => {
  const [userInfo, setUserinfo] = useRecoilState(userState);
  const id = useRecoilValue(userIdState)
  const hiddenFileInput = React.useRef(null);
  const [img, setImg] = useState(null);

  var showImg = userInfo.img || '/assets/Craft.png'

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

  return (
    <div className='user-profile-container'>
      <input type='file' accept=".jpg, .jpeg, .png" ref={hiddenFileInput} style={{display: 'none'}} onChange={handleFileChange}/>
      <div>
      <img className='user-profile-container-image' src={img} onClick={() => {hiddenFileInput.current.click()}} style={{height: '50px', width: '50px', borderRadius: '50%'}}></img>
        {userInfo.username}</div>
    </div>
  )
}

export default UserProfile;