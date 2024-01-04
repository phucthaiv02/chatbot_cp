import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
} from "../helpers/api-communicator";

// type User = {
//   name: string;
//   email: string;
// };
// type UserAuth = {
//   isLoggedIn: boolean;
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
//   logout: () => Promise<void>;
// };
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // fetch if the user's cookies are valid then skip login
    async function checkStatus() {
      try {
        const data = await checkAuthStatus();
        setUser({ email: data.email, name: data.name, role: data.role });
        setIsLoggedIn(true);
      }
      catch(e) {
      }
    }
    checkStatus();
  }, []);
  const login = async (email, password) => {
    const userInfo = await loginUser(email, password);
    if (userInfo) {
      setUser({ email: userInfo.email, name: userInfo.name, role: userInfo.role });
      setIsLoggedIn(true);
    }
  };
  const signup = async (name, email, password, confirmPassword) => {
    const userInfo = await signupUser(name, email, password, confirmPassword);
    if (userInfo) {
      setUser({ email: userInfo.email, name: userInfo.name, role: userInfo.role });
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    if(user)
      await logoutUser(user?.email);
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    signup,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
