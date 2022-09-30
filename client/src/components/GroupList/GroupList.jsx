import React from "react";

const GroupList = (props) => {
    return (
      <div id='group-list' className='widget'>
        <div className='widget-title'>Groups</div>
        <div className='group-list-group'>Group 1</div>
        <div className='group-list-group'>Group 2</div>
        <div className='group-list-group'>Group 3</div>
        <div className='group-list-group'>Group 4</div>
        <div className='button'>create a group</div>
      </div>
    )
  }

  export default GroupList;