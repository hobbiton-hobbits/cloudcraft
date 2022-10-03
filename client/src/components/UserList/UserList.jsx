import React from "react";

// This component renders a list of all users stored in the database, any of whom can be chatted with
const UserList = (props) => {
    return (
      <div id='user-list' className='widget'>
        <div className='widget-title'>Users</div>
          <div id='user-list-users'>
            <div className='user-list-user'>
              <div className='user-list-user-fullname'>First Name</div>
              <div className='user-list-user-username'>username</div>
            </div>
            <div className='user-list-user'>
              <div className='user-list-user-fullname'>First Name</div>
              <div className='user-list-user-username'>username</div>
            </div>
            <div className='user-list-user'>
              <div className='user-list-user-fullname'>First Name</div>
              <div className='user-list-user-username'>username</div>
            </div>
            <div className='user-list-user'>
              <div className='user-list-user-fullname'>First Name</div>
              <div className='user-list-user-username'>username</div>
            </div>
            <div className='user-list-user' id='selected'>
              <div className='user-list-user-fullname'>First Name</div>
              <div className='user-list-user-username'>username</div>
            </div>
            <div className='user-list-user'>
              <div className='user-list-user-fullname'>First Name</div>
              <div className='user-list-user-username'>username</div>
            </div>
          </div>
      </div>
    )
  }

  export default UserList;