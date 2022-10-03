import React, { useState, useEffect } from "react";
import axios from 'axios';
import { groupsState, groupState, recipientState, usersState, usernameState } from '../userAtoms.js';
import { useRecoilState, useRecoilValue } from 'recoil';

import Select from 'react-select';

// This component renders a list of all groups stored in the database that the user is a part of, any of which can be chatted with
// Groups can be denoted either by their member names, or optionally by a custom group name
const GroupList = (props) => {

  const users = useRecoilValue(usersState);
  const username = useRecoilValue(usernameState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const [group, setGroup] = useRecoilState(groupState);
  const [recipient, setRecipient] = useRecoilState(recipientState);

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  const createGroup = () => {
    var ids = selected.map(item => (
      item.id
    ))
    axios.post('/groups', {username, ids})
      .then(res => {
        console.log('result from creating group: ', res.data)
      })
  }

  const handleGroupClick = (i) => {
    setRecipient(null);
    setGroup(groups[i].group_id);
  }

  useEffect(() => {
    axios.get('/groups')
      .then(res => {
        console.log('groups: ', res.data.rows)
        setGroups(res.data.rows)
      })
  }, [])

  useEffect(() => {
    var tempOptions = [];
    users.forEach(user => {
      tempOptions.push({
        value: `${user.firstname} ${user.lastname}`,
        label: `${user.firstname} ${user.lastname}`,
        id: user.id
      })
    })
    setOptions(tempOptions);
  }, [users])

  return (
    <div id='group-list' className='widget'>
      <div className='widget-title'>Groups</div>
        <div id='group-list-groups'>
          {groups?.map((group, i) => (
            <div className='group-list-group' key={i} onClick={() => handleGroupClick(i)} id={groups[i].group_id === group ? 'selected' : 'not'}>Group 4</div>
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
      <div className='button' id='group-list-create-button' onClick={createGroup}>create a group</div>
      {/* placeholder select dropdown to create a new group */}
      <Select options={options} onChange={(selectedOption) => setSelected(selectedOption)} isMulti />
    </div>
  )
}

export default GroupList;