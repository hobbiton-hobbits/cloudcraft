import React, { useState } from 'react';
import styled from 'styled-components';

const Login = (props) => {
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [values, setValues] = useState({
    userName: '',
    passWord: ''
  });

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
    if(values.userName && values.passWord) {
      setValid(true);
  }
    setSubmitted(true);

    // if valid and submitted send form data to be authenticated
    //get response with jwt if in database
    //show error if error
    // show chat if no error
  };

  return (
    <div id="login" className="widget">
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit}>
      <label htmlFor="username">username</label>
      <input type="text" id="username" className="form-field" name="username"
      value={values.userName} onChange={handleUserNameInputChange}
      />
     { submitted && !values.userName && <span id="user-name-error">Please enter a username</span>}
     <br/>

      <label htmlFor="password">password</label>
      <input type="password" id="password" className="form-field" name="password"
      value={values.passWord} onChange={handlePassWordInputChange}
      />
     { submitted && !values.passWord && <span id="pass-word-error">Please enter a password</span>}
     <br/>
     <input type="submit" value="Submit"/>
      </form>
    </div>
  );
};

export default Login;
