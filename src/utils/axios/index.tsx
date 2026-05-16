import axios from "axios";
import { store } from '../../store';
import { logout } from '../../store/slice/auth/index';

export const instance = axios.create({
    baseURL: '',
    timeout: 10000,
    withCredentials: true
});

instance.interceptors.response.use(
    (response) => response, // 2xx — пропускаем как есть
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);