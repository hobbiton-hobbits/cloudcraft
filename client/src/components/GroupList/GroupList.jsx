import React, { useState, useEffect } from "react";
// react-select to enable multi-user select
import Select from 'react-select';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
// atoms to hold global state using Recoil
import {
  userIdState,
  groupListState,
  groupIdState,
  recipientListState,
  userState
} from '../userAtoms.js';

// This component renders a list of all groups stored in the database that the user is a part of, any of which can be chatted with
// Groups can be denoted either by their member names, or optionally by a custom group name
const GroupList = (props) => {
  const { socket } = props;
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  // import Recoil state from atoms
  const userId = useRecoilValue(userIdState);
  const user = useRecoilValue(userState);
  const recipientList = useRecoilValue(recipientListState);
  const [groupList, setGroupList] = useRecoilState(groupListState);
  const [groupId, setGroupId] = useRecoilState(groupIdState);

  // group creation method
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

  // click handler for when the group is clicked on
  // when clicked, the group clicked on will become the active group in the current chat pane
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

  // display usernames when full names are duplicates
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

  // get the list of groups from the server
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

  // when the component is loaded
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