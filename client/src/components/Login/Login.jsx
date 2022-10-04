import React, { useState } from 'react';
import Register from "./register.jsx";
import axios from 'axios';
import {
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {
  usernameState,
} from '../userAtoms.js';

const divStyle = {
  justifyContent:'center',
  alignItems: 'center',
  padding: '1em',
  width: 'fit-content',
  margin: '1em auto',
}

const formStyle = {
  margin: 'auto'
}

const inputErrStyle ={
  color: 'red'
}

const inputStyle = {
  border: 'solid',
  borderWidth: 'thin'

}

const regBtn = {
  margin: '5px'
}

const Login = ({setLoggedIn}) => {
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useRecoilState(usernameState);
  const [valid, setValid] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false)
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const handleUserNameInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      username: event.target.value,
    }));
  };

  const handlePassWordInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      password: event.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(values.username && values.password) {
      setValid(true);
  }
    setSubmitted(true);
    console.log('LOGIN VALUES:', values);
    axios.post('http://ec2-3-128-156-90.us-east-2.compute.amazonaws.com:8087/login', values)
    .then((data) => {
      console.log(data.data);
      axios.defaults.headers.common['Authorization'] = `BEARER ${data.data.accessToken}`;
      setUser({
        username: data.data.username,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        img: null
      });
      return;
    })
    .then((val) => {
      setLoggedIn(true);
      return;
    })
    .catch((err) => {
      console.log(err);
    });

    // if valid and submitted send form data to be authenticated
    // get response with jwt if in database
    // show error if error
    // show chat if no error
  };

  const handleRegister = (e) => {
    setIsRegistering(true);
  }


  if (isRegistering) {
    return (
      <div>
        <Register setIsRegistering={setIsRegistering}/>
      </div>
    );
  } else {

    return (
      <div style={divStyle} id="login" className="widget">
      <h1>LOGIN</h1>
      <form  style={formStyle} onSubmit={handleSubmit}>
      <label htmlFor="username">username </label>
      <input style={inputStyle} type="text" className="username" className="form-field" name="username"
      value={values.userName} onChange={handleUserNameInputChange} />
       <br/>
     { submitted && !values.userName && <span style={inputErrStyle} id="user-name-error">Please enter a username</span>}
     <br/>
      <label htmlFor="password">password </label>
      <input style={inputStyle} type="password" className="password" className="form-field" name="password"
      value={values.passWord} onChange={handlePassWordInputChange} />
       <br/>
     { submitted && !values.passWord && <span style={inputErrStyle} id="pass-word-error">Please enter a password</span>}
     <br/>
     <input type="submit" value="Submit"/>
     <button style={regBtn} onClick={(e) => {handleRegister(e)}}>Need to Register?</button>
      </form>
    </div>
    );
  }
};

export default Login;
