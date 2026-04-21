import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { useNavigate } from "react-router";
import { useEffect } from "react";


export const useAuth = () => {
  const navigate = useNavigate();

  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context; // from state layer

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    };
    
    
      useEffect(() => {
        const getAndSetUser = async () => {
          const data = await getMe();
          setUser(data.user);
          setLoading(false);
        };
    
        getAndSetUser();
      }, []);
    

  return { loading, user, handleLogin, handleRegister, handleLogout };
};
