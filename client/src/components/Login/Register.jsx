import React, { useState } from 'react';
import styled from 'styled-components';
// import {useRef} from 'react';

// #register {
//   margin: 35%;
//   width: 30%;
//   height: 300px;
//   justify-content: center;
//   align-items: center;
// }

const Register = (props) => {
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    passWord: '',
  });


  const handleFirstNameInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      firstName: event.target.value,
    }));
  };

  const handleLastNameInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      lastName: event.target.value,
    }));
  };

  const handleUserNameInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      userName: event.target.value,
    }));
  };

  const handlePassWordInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      passWord: event.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(values.firstName && values.lastName && values.userName && values.passWord) {
      setValid(true);
  }
    setSubmitted(true);

    // if valid and submitted send from data to auth database
    //set states for form back to empty string
    // show login page
  };

  return (
    <div id="register" className="widget">
      <h1>REGISTER</h1>

      <form onSubmit={handleSubmit}>

      <label htmlFor="firstname">first name</label>
      <input type="text" id="firstname" className="form-field" name="firstname" value={values.firstName} onChange={handleFirstNameInputChange}/>
      {submitted && !values.firstName && <span id='first-name-error'>Please enter a first name</span>}
      <br/>

      <label htmlFor="lastname">last name</label>
      <input type="text" id="lastname" className="form-field" name="lastname" value={values.lastName} onChange={handleLastNameInputChange}/>
     { submitted && !values.lastName && <span id="last-name-error">Please enter a last name</span>}
      <br/>

      <label htmlFor="username">username</label>
      <input type="text" id="username" className="form-field" name="username" value={values.userName} onChange={handleUserNameInputChange} />
     { submitted && !values.userName && <span id="user-name-error">Please enter a username</span>}
     <br/>

      <label htmlFor="password">password</label>
      <input type="password" id="password" className="form-field" name="password" value={values.passWord} onChange={handlePassWordInputChange}/>
     { submitted && !values.passWord && <span id="pass-word-error">Please enter a password</span>}
     <br/>

      <input type="submit" value="Submit"/>

      </form>
    </div>
  );
};

export default Register;