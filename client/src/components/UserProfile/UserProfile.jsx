import React, { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState } from '../userAtoms.js';
import axios from 'axios';

const UserProfile = () => {
  const userInfo = useRecoilState(userState);
  const [showImgModal, setShowImgModal] = useState(false);

  const hiddenFileInput = React.useRef(null);

  var img = userInfo[0].img || 'https://www.freevector.com/uploads/vector/preview/2353/FreeVector-Boat-Logo-Graphics.jpg'

  const updateImage = (e) => {
    let file = document.querySelector('input[type=file]').files[0];
    let url = URL.createObjectURL(file);
    var temp = Object.assign({}, userInfo);
    temp.img = url;
    setUserinfo(temp)
    setShowImgModal(false);
  }

  return (
    <div className='user-profile-container'>
      <input type='file' accept=".jpg, .jpeg, .png" ref={hiddenFileInput} style={{display: 'none'}} onChange={updateImage}/>
      <div>
      <img className='user-profile-container-image' src={img} onClick={() => {hiddenFileInput.current.click()}} style={{height: '50px', width: '50px', borderRadius: '50%'}}></img>
        {userInfo[0].username}</div>
    </div>
  )
}

export default UserProfile;