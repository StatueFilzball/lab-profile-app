import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
 
function SignUp(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState("");
  const [course, setCourse] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
 
  const navigate = useNavigate();
  
  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleCampus = (e) => setCampus(e.target.value);
  const handleCourse = (e) => setCourse(e.target.value);

 
  
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { username, password, campus, course };
 
    // Make an axios request to the API
    // If the POST request is a successful redirect to the login page
    // If the request resolves with an error, set the error message in the state
    // axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, requestBody)
    axios.post("http://localhost:5005/auth/signup", requestBody)

    .then((response) => {
        navigate('/login');
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      })
  };
 
  
  return (
    <div className="SignupPage">
      <h1>Sign Up</h1>
 
      <form onSubmit={handleSignupSubmit}>
        <label>Username:</label>
        <input 
          type="text"
          name="username"
          value={username}
          onChange={handleUsername}
        />
 
        <label>Password:</label>
        <input 
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
 
        <label>Campus:</label>
        <input 
          type="text"
          name="campus"
          value={campus}
          onChange={handleCampus}
        />

        <label>Course:</label>
        <input 
          type="text"
          name="course"
          value={course}
          onChange={handleCourse}
        />
 
        <button type="submit">Create the Account</button>
      </form>
 
      { errorMessage && <p className="error-message">{errorMessage}</p> }
 
      <p>Already have account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  )
}
 
export default SignUp;