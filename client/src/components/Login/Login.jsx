import React, { useState } from 'react';
import Register from "./register.jsx";
import axios from 'axios';
import {
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {
  userState,
} from '../userAtoms.js';

const divStyle = {
  justifyContent:'center',
  alignItems: 'center',
  width: 'fit-content',
  margin: '1em auto',
  position:'relative',
  marginTop: '10%',
}

const formStyle = {
  margin: 'auto',
  padding: '1em',
  fontSize: '200%'
}

const inputErrStyle ={
  color: 'red',
  fontSize: '20px',
  float:'right',

}

const inputStyle = {
  border: 'solid',
  borderWidth: 'thin',
  borderColor: 'grey',
  fontSize: '100%'
}

const regBtn = {
  marginRight: '5px',
  marginLeft: '5px',
  paddingTop: '1px',
  paddingBottom:'1px',
  fontSize: '80%',
  display: 'inline-block'
}

const subBtn = {
  marginRight: '5px',
  marginLeft: '5px',
  paddingTop: '1px',
  paddingBottom:'1px',
  fontSize: '80%'
}

const headerDiv ={
  backgroundColor: 'rgb(163, 206, 241)',
  color: 'white',
  postion: 'absolute',
  width: '100%',
  textAlign: 'center',
  fontSize: '150%'
}

const Login = () => {
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [valid, setValid] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(null);
  const[invalidUser, setInvalidUser] =useState(null);
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
    if(event.target.value === ''){
      setIncorrectPassword(null)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(values.username && values.password) {
      setValid(true);
  }
    setSubmitted(true);
    axios.post('http://ec2-3-128-156-90.us-east-2.compute.amazonaws.com:8087/login', values)
    .then((data) => {
      console.log(data.data);
      axios.defaults.headers.common['Authorization'] = `BEARER ${data.data.accessToken}`;
      localStorage.setItem('token', data.data.refreshToken);
      localStorage.setItem('accessToken', data.data.accessToken);
      console.log(data.data);
      localStorage.setItem('username', data.data.username);
      localStorage.setItem('firstname', data.data.firstName);
      localStorage.setItem('lastname', data.data.lastName);
      // setUser({
      //   username: data.data.username,
      //   firstname: data.data.firstName,
      //   lastname: data.data.lastName,
      //   img: null
      // });
      return;
    })
    .then((val) => {
      return axios.post('/auth')
    })
    .then((data) => {
      if (data.data.check) {
        localStorage.setItem('tokenGood', true);
      }
      return;
    })
    .then((val) => {
      localStorage.setItem('loggedIn', true);
      // setLoggedIn(true);
      localStorage.setItem('count', '1');
      window.location.reload(false);
      return;
    })
    .catch((err) => {
      console.log(err);
      if(err.response.data ===
        'Incorrect Password'){
        setIncorrectPassword(true);
      }

      if(err.response.data ===
        'Username Not Found'){
        setInvalidUser(true);
      }
    });
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
        <div style={headerDiv}>
          <h1 >LOGIN</h1>
        </div>
        <br/>
      <form  style={formStyle} onSubmit={handleSubmit}>
      <label htmlFor="username">Username </label>
      <input style={inputStyle} type="text" className="username" className="form-field" name="username"
      value={values.userName} onChange={handleUserNameInputChange} required/>
       <br/>
     { submitted && !values.username && <span style={inputErrStyle} id="user-name-error">Please enter a username</span>}
     { submitted && values.username && invalidUser && <span style={inputErrStyle} id="user-name-error">
      invalid user
         </span>}
     <br/>
      <label htmlFor="password">Password </label>
      <input style={inputStyle} type="password" className="password" className="form-field" name="password"
      value={values.passWord} onChange={handlePassWordInputChange} required/>
       <br/>
     { submitted && !values.password && <span style={inputErrStyle} id="pass-word-error">Please enter a password</span>}
     { submitted && values.username && incorrectPassword && <span style={inputErrStyle} id="user-name-error">
      unrecognized password
         </span>}
     <br/>
     <input style={subBtn} className= 'button' type="submit" value="Submit"/>
     <div style={regBtn} className= 'button' onClick={handleRegister}>Need to Register?</div>
      </form>
    </div>


    );
  }
};

export default Login;
