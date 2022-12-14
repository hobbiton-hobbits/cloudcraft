import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  userIdState,
  groupListState,
  groupIdState,
  recipientIdState,
  recipientListState,
  userState,
  groupState
} from '../userAtoms.js';
import { useRecoilState, useRecoilValue } from 'recoil';

import Select from 'react-select';

// This component renders a list of all groups stored in the database that the user is a part of, any of which can be chatted with
// Groups can be denoted either by their member names, or optionally by a custom group name
const GroupList = (props) => {
  const { socket } = props;
  const userId = useRecoilValue(userIdState);
  const user = useRecoilValue(userState);
  const recipientList = useRecoilValue(recipientListState);
  const [groupList, setGroupList] = useRecoilState(groupListState);
  const [groupId, setGroupId] = useRecoilState(groupIdState);
  const [group, setGroup] = useRecoilState(groupState);
  const [recipientId, setRecipientId] = useRecoilState(recipientIdState);

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  const createGroup = () => {
    var ids = selected.map(item => (
      item.id
    ))
    ids.push(userId)
    const names = selected.map(item => (
      item.value
    ));
    names.push(`${user.firstname} ${user.lastname}`)
    if (ids.length < 3) {
      alert('You need more than 3 members for a group!')
      return;
    }
    axios.post('/groups', { ids, names })
      .then((res) => {
        // getGroupList();
        socket.emit('create-group', ids);
      });
  };

  const handleGroupClick = (i) => {
    if (groupId !== groupList[i].group_id) {
      socket.emit('leave-room', groupId);
      socket.emit('join-room', groupList[i].group_id);
      setGroupId(groupList[i].group_id);
      return;
    }
    if (!groupId && recipientId) {
      setRecipientId(null);
      socket.emit('join-room', groupList[i].group_id);
      setGroupId(groupList[i].group_id);
      return;
    }
  };

  const listUsernames = (namesArr) => {
    var result = '';
    namesArr?.forEach(name => {
      if (name !== `${user.firstname} ${user.lastname}`) {
        result += `${name}, `;
      }
    })
    result = result.slice(0, -2);
    return result;
  }

  const getGroupList = () => {
    var data = {
      params: { userId }
    };
    if (userId) {
      axios.get('/groups', data)
      .then(res => {
        console.log('groups: ', res.data)
        setGroupList(res.data)
      });
    }
  };

  useEffect(() => {
    getGroupList();
    console.log('user state: ', user);
  }, [userId]);

  useEffect(() => {
    var tempOptions = [];
    recipientList.forEach(user => {
      tempOptions.push({
        value: `${user.firstname} ${user.lastname}`,
        label: `${user.firstname} ${user.lastname}`,
        id: user.id
      })
    })
    setOptions(tempOptions);
  }, [recipientList]);

  useEffect(() => {
    socket.on('refresh-group', () => {
      getGroupList();
    })
  }, [socket])

  return (
    <div id='group-list' className='widget'>
      <div className='widget-title'>Groups</div>
        <div id='group-list-groups'>
          {groupList?.map((group, i) => (
            <div className='group-list-group' key={i} onClick={() => handleGroupClick(i)} id={group.group_id === groupId ? 'selected' : null}>{listUsernames(group.user_names)}</div>
          ))}
        </div>
        <div className='group-list-select'>
          <Select options={options} onChange={(selectedOption) => setSelected(selectedOption)} isMulti />
          <div className='button' id='group-list-create-button' onClick={createGroup}>create a group</div>
        </div>
    </div>
  )
}

export default GroupList;