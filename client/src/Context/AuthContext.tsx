import { createContext } from 'react'
import Auth from './Auth';


let authenticator = new Auth();
const AuthContext = createContext(authenticator);

export const AuthContextProvider = AuthContext.Provider

export default AuthContext;