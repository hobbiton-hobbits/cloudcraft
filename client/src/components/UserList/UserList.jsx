import React, { useEffect } from "react";
import axios from 'axios';
import {
  userIdState,
  recipientListState,
  groupIdState,
  recipientIdState,
  messageState,
} from '../userAtoms.js';
import { useRecoilState, useRecoilValue } from 'recoil';

const UserList = (props) => {
  const { socket } = props;
  const userId = useRecoilValue(userIdState);
  const [recipientList, setRecipientList] = useRecoilState(recipientListState);
  const [groupId, setGroupId] = useRecoilState(groupIdState);
  const [recipientId, setRecipientId] = useRecoilState(recipientIdState);

  const handleUserClick = (i) => {
    if (groupId) {
      socket.emit('leave-room', groupId);
    }
    setRecipientId(recipientList[i].id);
    console.log('switched recipient to: ', recipientList[i].id);
    setGroupId(null);
  }

  useEffect(() => {
    var data = {
      params: { userId }
    }
    if (userId) {
      axios.get('/users', data)
      .then(res => {
        setRecipientList(res.data)
      });
    }
  }, [userId]);

  return (
    <div id='user-list' className='widget'>
      <div className='widget-title'>Users</div>
        <div id='user-list-users'>
          {recipientList?.map((user, i) => {
            var img = user.img || '/assets/Craft.png'
            if (user.id === userId) {
              return null;
            }
            return (
            <div className='user-list-user' key={i} onClick={() => handleUserClick(i)} id={user.id === recipientId ? 'selected' : null}>
              <div className='user-list-user-fullname'>
                <img className='user-list-user-img' src={img} />
                <div>{`${user.firstname} ${user.lastname}  (${user.username})`}</div>
              </div>
            </div>
          )})}
        </div>
    </div>
  )
}

export default UserList;