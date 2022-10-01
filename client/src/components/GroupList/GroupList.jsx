import React from "react";

// This component renders a list of all groups stored in the database that the user is a part of, any of which can be chatted with
// Groups can be denoted either by their member names, or optionally by a custom group name
const GroupList = (props) => {
    return (
      <div id='group-list' className='widget'>
        <div className='widget-title'>Groups</div>
          <div id='group-list-groups'>
            <div className='group-list-group'>Group 1</div>
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
            <div className='group-list-group'>Group 4</div>
            <div className='group-list-group'>Group 4</div>
          </div>
        <div className='button' id='group-list-create-button'>create a group</div>
      </div>
    )
}

export default GroupList;