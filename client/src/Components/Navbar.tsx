import React from 'react';
import { useAuth } from "../Context/AuthContext"
const Navbar: React.FC = () => {

  const { currentUser, signIn, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log(currentUser);
      await signOut();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-name">Tasquerie</div>
        <div className="navbar-menu">
          {currentUser ? (
                <div style={{display: "flex", alignItems: "center"}}>
                    <p className="user--name"> {currentUser.displayName}</p>
                    <span>
                        <img className="user--photo" src={currentUser.photoURL} alt={"user id"}></img>
                    </span>
                    <span>
                        <button onClick={handleSignOut}>Logout</button>
                    </span>
                </div>
            ) : (
                <div>
                    <button onClick={handleSignIn}>Login</button>
                </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
