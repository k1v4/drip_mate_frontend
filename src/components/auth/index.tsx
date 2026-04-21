import React, { JSX, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './login';
import RegisterPage from './register';
import './style.scss';
import { Box } from '@mui/material';
import { instance } from '../../utils/axios';
import { useAppDispatch } from '../../utils/hook';
import { login } from '../../store/slice/auth';
import { AppErrors } from '../../common/errors';
import { useAuth } from '../../context/AuthContext';

const AuthRootComponent: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retryPassword, setRetryPassword] = useState('');
    const [userName, setUserName] = useState('');

    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { setTokens } = useAuth();

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (location.pathname === '/login') {
            try {
                const response = await instance.post('/api/v1/login', {
                    email,
                    password,
                });

                const { access_token, refresh_token, access_id } = response.data;

                setTokens({ accessToken: access_token, refreshToken: refresh_token });
                localStorage.setItem('access_id', access_id);

                await dispatch(login(response.data));
                navigate('/');
            } catch (e) {
                console.error('Ошибка при входе:', e);
            }
        } else {
            try {
                if (password !== retryPassword) {
                    throw new Error(AppErrors.PasswordNotMatch);
                }

                const response = await instance.post('/api/v1/register', {
                    email,
                    userName,
                    password,
                });

                await dispatch(login(response.data));
                navigate('/login');
            } catch (e) {
                console.error('Ошибка при регистрации:', e);
            }
        }
    };

    return (
        <div className="root">
            {/* Левая часть */}
            <div className="left">
                <h1>DRIP MATE</h1>
                <p>Создавай свой стиль.</p>
                <p className="secondary">Платформа для тех, кто в теме.</p>
            </div>

            {/* Разделитель */}
            <div className="divider" />

            {/* Правая часть */}
            <div className="right">
                <form className="form" onSubmit={handleSubmit}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center" // ⬅️ тоже важно
                        width="100%"
                        padding={4}
                        borderRadius={5}
                        bgcolor="#141414"
                    >
                        {
                            location.pathname === '/login'
                                ? <LoginPage setEmail={setEmail} setPassword={setPassword} navigate={navigate} />
                                : <RegisterPage
                                    setEmail={setEmail}
                                    setPassword={setPassword}
                                    setRetryPassword={setRetryPassword}
                                    setUserName={setUserName}
                                    navigate={navigate}
                                />
                        }
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default AuthRootComponent;