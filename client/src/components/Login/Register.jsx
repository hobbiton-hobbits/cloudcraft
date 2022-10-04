import React, { useState, useEffect } from 'react';
import axios from 'axios';


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
const Register = ({setIsRegistering}) => {
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
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
      passWord: event.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('VALUES:', values);

    if(values.firstName && values.lastName && values.username && values.password) {
      setValid(true);
  }
    setSubmitted(true);
    axios.post('http://ec2-3-128-156-90.us-east-2.compute.amazonaws.com:8087/register', values)
      .then((data) => {
        console.log(data.data);
        setIsRegistering(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={divStyle} id="register" className="widget">
      <h1>REGISTER</h1>

      <form  onSubmit={handleSubmit} style={formStyle} >

      <label htmlFor="firstname">first name </label>
      <input style={inputStyle} type="text" className="firstname" className="form-field" name="firstname" value={values.firstName} onChange={handleFirstNameInputChange}/>
      <br/>
      {submitted && !values.firstName && <span style={inputErrStyle} id='first-name-error'>Please enter a first name</span>}
      <br/>

      <label htmlFor="lastname">last name </label>
      <input style={inputStyle} type="text" id="lastname" className="form-field" name="lastname" value={values.lastName} onChange={handleLastNameInputChange}/>
      <br/>
     { submitted && !values.lastName && <span style={inputErrStyle} id="last-name-error">Please enter a last name</span>}
      <br/>

      <label htmlFor="username">username </label>
      <input style={inputStyle} type="text" id="username" className="form-field" name="username" value={values.userName} onChange={handleUserNameInputChange} />
      <br/>
     { submitted && !values.userName && <span style={inputErrStyle} id="user-name-error">Please enter a username</span>}
     <br/>

      <label htmlFor="password">password </label>
      <input style={inputStyle} type="password" className="password" className="form-field" name="password" value={values.passWord} onChange={handlePassWordInputChange}/>
      <br/>
     { submitted && !values.passWord && <span style={inputErrStyle} id="pass-word-error">Please enter a password</span>}
     <br/>

      <input type="submit" value="Submit"/>

      </form>
    </div>
  );
};

export default Register;