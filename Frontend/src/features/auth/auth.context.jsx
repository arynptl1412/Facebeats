import { createContext, useState } from "react";
import { loginFunc, registerFunc } from "./services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (email, password) => {
        try {
            setLoading(true);

            const data = await loginFunc(email, password);

            setUser(data.user);

            return { success: true };

        } catch (err) {
            console.log(err);

            setUser(null);

            return {
                success: false,
                message: err.response?.data?.message || "Login Failed"
            };

        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async(username, email, password, fullName) => {
        try{
            setLoading(false);

            const data = await registerFunc(username, email, password, fullName);

            setUser(data.user);

            return {
                success: true
            }
        }catch(err){
            console.log(err);
            setUser(null);
            return{
                success:false,
                message: err.response?.data?.message || "Registration Failed"
            }
        }finally{
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, handleLogin, handleRegister }}>
            {children}
        </AuthContext.Provider>
    );
};