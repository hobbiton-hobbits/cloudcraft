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
    console.log(selected)
    // axios.post('/groups', { ids, names })
    axios.post('/groups', { ids })
      .then(res => {
        console.log('result from creating group: ', res.data)
      })
  }

  const handleGroupClick = (i) => {
    if (groupId) {
      socket.emit('leave-room', groupId);
    }
    setRecipientId(null);
    setGroupId(groupList[i].group_id);
    socket.emit('join-room', groupList[i].group_id);
  }

  const listUsernames = (arr) => {
    var result = '';
    arr.forEach(id => {
      result += `${id},`;
    })
    result = result.slice(0, -1);
    return result;
  }

  useEffect(() => {
    var data = {
      params: {
        userId
      }
    }
    axios.get('/groups', data)
      .then(res => {
        console.log('groups: ', res.data)
        setGroupList(res.data)
      })
  }, [])

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
  }, [recipientList])

  return (
    <div id='group-list' className='widget'>
      <div className='widget-title'>Groups</div>
        <div id='group-list-groups'>
          {groupList?.map((group, i) => (
            <div className='group-list-group' key={i} onClick={() => handleGroupClick(i)} id={group.group_id === groupId ? 'selected' : null}>{listUsernames(group.user_ids)}</div>
          ))}
          {/* <div className='group-list-group'>Group 1</div>
          <div className='group-list-group'>Group 2</div>
          <div className='group-list-group'>Group 3</div>
          <div className='group-list-group'>Group 4</div>
          <div className='group-list-group'>Group 4</div>
          <div className='group-list-group'>Group 4</div>
          <div className='group-list-group'>Group 4</div>
          <div className='group-list-group'>Group 4</div>
          <div className='group-list-group'>Group 4</div>
          <div className='group-list-group'>Group 4</div>
          <div className='group-list-group'>Group 4</div>
          <div className='group-list-group'>Group 4</div> */}
        </div>
      <Select options={options} onChange={(selectedOption) => setSelected(selectedOption)} isMulti />
      <div className='button' id='group-list-create-button' onClick={createGroup}>create a group</div>
    </div>
  )
}

export default GroupList;