import { Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import React, { JSX, useState } from 'react';
import { IPropsRegister } from '../../../common/types/auth';
import { instance } from '../../../utils/axios';

const RegisterPage: React.FC<IPropsRegister> = (props: IPropsRegister): JSX.Element => {
  const { navigate } = props;

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [retryPassword, setRetryPassword] = useState<string>('');

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [retryError, setRetryError] = useState<string>('');

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // ===== validation =====
  const validateFields = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError('Email не может быть пустым');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Пароль не может быть пустым');
      isValid = false;
    } else if (password.length < 10) {
      setPasswordError('Пароль должен содержать не менее 10 символов');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== retryPassword) {
      setRetryError('Пароли не совпадают');
      isValid = false;
    } else {
      setRetryError('');
    }

    return isValid;
  };

  // ===== submit =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      setSnackbarMessage('Пожалуйста, исправьте ошибки в форме');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await instance.post(
        '/api/v1/register',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const { access_level } = response.data;

      localStorage.setItem('access_level', String(access_level));

      console.log('Успешная регистрация');

      navigate('/onboarding');
    } catch (error: any) {
      console.error('Ошибка регистрации:', error);

      const message =
        error.response?.data?.message || 'Ошибка регистрации';

      setSnackbarMessage(message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography variant="h6" fontFamily="Inter" textAlign="center" color="#ddd">
        Зарегистрируйтесь на нашем сайте, чтобы получить возможность стать сваговей!
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        variant="outlined"
        placeholder="Введите ваш email"
        error={!!emailError}
        helperText={emailError}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        type="password"
        fullWidth
        margin="normal"
        label="Password"
        variant="outlined"
        placeholder="Введите ваш пароль"
        error={!!passwordError}
        helperText={passwordError}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        type="password"
        fullWidth
        margin="normal"
        label="Retry Password"
        variant="outlined"
        placeholder="Повторите ваш пароль"
        error={!!retryError}
        helperText={retryError}
        onChange={(e) => setRetryPassword(e.target.value)}
      />

      <Button
        type="submit"
        onClick={handleSubmit}
        sx={{
          fontFamily: 'Inter',
          marginTop: 1.5,
          width: '65%',
          marginBottom: 2,
          background: '#2B2B2B',
          borderRadius: '15px',
          color: '#fff',
          '&:hover': {
            background: '#3A3A3A',
          },
        }}
        variant="contained"
      >
        Регистрация
      </Button>

      <Typography
        variant="body1"
        sx={{
          fontFamily: 'Poppins',
          color: '#aaa',
          fontSize: '3vh',
          textAlign: 'center',
        }}
      >
        У вас уже есть аккаунт?
      </Typography>

      <Button
        type="button"
        sx={{
          fontFamily: 'Inter',
          marginTop: 1.5,
          width: '65%',
          backgroundColor: '#2B2B2B',
          borderRadius: '15px',
          color: '#fff',
          border: '1px solid #444',
          '&:hover': {
            backgroundColor: '#3A3A3A',
          },
        }}
        variant="contained"
        onClick={() => navigate('/login')}
      >
        Войти 
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterPage;