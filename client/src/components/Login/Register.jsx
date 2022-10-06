import React, { useState, useEffect } from 'react';
import axios from 'axios';


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
  fontSize: '150%'
}

const inputErrStyle ={
  color: 'red',
  fontSize: '20px',
  float:'right'
}

const inputStyle = {
  border: 'solid',
  borderWidth: 'thin',
  float: 'right',
  borderColor: 'grey',
  fontSize: '100%'
}
const labelStyle = {
  margin: '3px'
}

const Btn = {
  marginRight: '5px',
  marginLeft: '5px',
  paddingTop: '1px',
  paddingBottom:'1px',
  fontSize: '100%'
}

const Btn2 = {
  marginRight: '5px',
  marginLeft: '5px',
  paddingTop: '1px',
  paddingBottom:'1px',
  fontSize: '100%'
}

const headerDiv ={
  backgroundColor: 'rgb(163, 206, 241)',
  color: 'white',
  postion: 'absolute',
  width: '100%',
  textAlign: 'center',
  fontSize: '150%'
}

const Register = ({setIsRegistering}) => {
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const[validPass, setValidPass] = useState(null)
  const [taken, setTaken] = useState(false);
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirm:''
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

  const handleConfirmInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      confirm: event.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('VALUES:', values);

    if(values.firstName && values.lastName && values.username && values.password && values.confirm) {
      setValid(true);
  }
    setSubmitted(true);

    if(values.confirm === values.password){
      axios.post('http://ec2-3-128-156-90.us-east-2.compute.amazonaws.com:8087/register', values)
      .then((data) => {
        console.log(data.data);
        setIsRegistering(false);
      })
      .catch((err) => {
        console.log(err);
        if(err.response.data === 'Username Already Taken'){
          setTaken(true);
        }
      });
    }
  };

  const handleBackToLog = (e) =>{
    setIsRegistering(false);
  }

  return (
    <div style={divStyle} id="register" className="widget">
      <div style={headerDiv}>
       <h1>REGISTER</h1>
      </div>


      <form  onSubmit={handleSubmit} style={formStyle} >

      <label style = {labelStyle} htmlFor="firstname">First Name </label>
      <input style={inputStyle} type="text" className="firstname" className="form-field" name="firstname" value={values.firstName} onChange={handleFirstNameInputChange}/>
      <br/>
      {submitted && !values.firstName && <span style={inputErrStyle} id='first-name-error'>Please enter a first name</span>}
      <br/>

      <label style = {labelStyle} htmlFor="lastname">Last Name </label>
      <input style={inputStyle} type="text" id="lastname" className="form-field" name="lastname" value={values.lastName} onChange={handleLastNameInputChange}/>
      <br/>
     { submitted && !values.lastName && <span style={inputErrStyle} id="last-name-error">Please enter a last name</span>}
      <br/>

      <label style = {labelStyle} htmlFor="username">Username </label>
      <input style={inputStyle} type="text" id="username" className="form-field" name="username" value={values.userName} onChange={handleUserNameInputChange} />
      <br/>
      { submitted && !values.username && <span style={inputErrStyle} id="user-name-error">
      Please enter a username
         </span>}
         { submitted && values.username && taken && <span style={inputErrStyle} id="user-name-error">
      username taken
         </span>}
     <br/>

      <label style = {labelStyle} htmlFor="password">Password </label>
      <input style={inputStyle} type="password" className="password" className="form-field" name="password" value={values.password} onChange={handlePassWordInputChange}/>
      <br/>
     { submitted && !values.password && <span style={inputErrStyle} id="pass-word-error">Please enter a password</span>}
     <br/>

     <label style = {labelStyle} htmlFor="confirm" > Confirm </label>
      <input style={inputStyle} type="password" className="confirm" className="form-field" name="confirm" value={values.confirm} onChange={handleConfirmInputChange}/>
      <br/>
     { submitted && !values.confirm && <span style={inputErrStyle} id="confirm-error">Please confirm password</span>}
     { submitted && values.confirm && (values.confirm !== values.password) && <span style={inputErrStyle} id="confirm-error">does not match password</span>}
     <br/>

      <input style={Btn2} type="submit" value="Submit"/>
      <button style={Btn} onClick={handleBackToLog}>Back to Login</button>

      </form>
    </div>
  );
};

export default Register;