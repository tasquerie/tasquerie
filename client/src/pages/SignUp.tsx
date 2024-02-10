import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const SignUp = () => {
  return (
    <div>
      <h1>Welcome to Tasquerie</h1>
      <p> Tasquierie is an app that gamifies productivity</p>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;