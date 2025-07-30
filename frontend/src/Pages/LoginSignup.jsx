import React, { useState } from 'react';
import './CSS/LoginSignup.css';

// Define your deployed backend URL as a constant
const BACKEND_API_BASE_URL = 'https://mern-e-commerce-backend-9xbi.onrender.com';

export const LoginSignup = () => {
  const [state, setState] = useState("Login");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);
    let responseData;
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem('auto-token', responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const signup = async () => {
    console.log("SignUp Function Executed", formData);
    let responseData;
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem('auto-token', responseData.token);
        window.location.replace("/");
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>

        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder="Full Name" /> : <></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Sign Up" ?
          <p className="loginsignup-login">
            Already have an account? <span onClick={() => { setState("Login") }}>Login here</span>
          </p> :
          <p className="loginsignup-login">
            Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span>
          </p>
        }

        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>
            By continuing, I agree to the <strong>Terms of Use</strong> & <strong>Privacy Policy</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
