import React from 'react';
import { useAuth } from "../Context/AuthContext"
const Navbar: React.FC = () => {

  const { getUser, signIn, signUp, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      console.log("HER");
      const username = "apple@uw.edu";
      const password = "aaaaaa";
      await signIn(username, password);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log(getUser());
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUp = async () => {
    try {
      const username = "apple@uw.edu";
      const password = "aaaaaa";
      await signUp(username, password);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-name">Tasquerie</div>
        <div className="navbar-menu">

          {getUser() ? (
                <div style={{display: "flex", alignItems: "center"}}>
                    <p className="user--name"> {getUser().displayName}</p>
                    <span>
                        <img className="user--photo" src={getUser().photoURL} alt={"user id"}></img>
                    </span>
                    <span>
                        <button onClick={handleSignOut}>Logout</button>
                    </span>
                </div>
            ) : (
                <div>
                    <button onClick={handleSignUp}>Sign Up</button>
                    <button onClick={handleSignIn}>Login</button>
                </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
