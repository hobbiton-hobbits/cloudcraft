import React, { useEffect } from "react";
import axios from 'axios';
import { userIdState, recipientListState, groupIdState, recipientIdState } from '../userAtoms.js';
import { useRecoilState, useRecoilValue } from 'recoil';

// This component renders a list of all users stored in the database, any of whom can be chatted with
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
    setGroupId(null);
  }

  useEffect(() => {
    var data = {
      params: {
        userId
      }
    }
    axios.get('/users', data)
      .then(res => {
        setRecipientList(res.data)
      })
  }, [])

  return (
    <div id='user-list' className='widget'>
      <div className='widget-title'>Users</div>
        <div id='user-list-users'>
          {recipientList?.map((user, i) => (
            <div className='user-list-user' key={i} onClick={() => handleUserClick(i)} id={user.id === recipientId ? 'selected' : null}>
              <div className='user-list-user-fullname'>{`${user.firstname} ${user.lastname}`}</div>
              <div className='user-list-user-username'>{user.username}</div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default UserList;