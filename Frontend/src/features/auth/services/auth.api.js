import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})

export const loginFunc = async (email, password) => {
    try {
        const response = await api.post('/login', {
            email,
            password
        })
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const registerFunc = async (username, email, password, fullName) => {
    try{
        const response = await api.post('/register', {
            username,
            email,
            password,
            fullName
        })
        return response.data;
    }catch(err){
        throw err;
    }
}