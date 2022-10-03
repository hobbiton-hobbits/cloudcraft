import React, { useEffect } from "react";
import axios from 'axios';
import { usersState, groupState, recipientState } from '../userAtoms.js';
import { useRecoilState } from 'recoil';

// This component renders a list of all users stored in the database, any of whom can be chatted with
const UserList = (props) => {

  const [users, setUsers] = useRecoilState(usersState);
  const [group, setGroup] = useRecoilState(groupState);
  const [recipient, setRecipient] = useRecoilState(recipientState);

  const handleUserClick = (i) => {
    setRecipient(users[i].id)
    setGroup(null);
  }

  useEffect(() => {
    axios.get('/users')
      .then(res => {
        setUsers(res.data.rows)
      })
  }, [])

  return (
    <div id='user-list' className='widget'>
      <div className='widget-title'>Users</div>
        <div id='user-list-users'>
          {users?.map((user, i) => (
            <div className='user-list-user' key={i} onClick={() => handleUserClick(i)} id={user.id === recipient ? 'selected' : null}>
              <div className='user-list-user-fullname'>{`${user.firstname} ${user.lastname}`}</div>
              <div className='user-list-user-username'>{user.username}</div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default UserList;