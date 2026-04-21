import { Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import React, { JSX, useState } from 'react';
import { IPropsLogin } from '../../../common/types/auth';

const LoginPage: React.FC<IPropsLogin> = (props: IPropsLogin): JSX.Element => {
  const { setEmail, setPassword, navigate } = props;

  const [localEmail, setLocalEmail] = useState<string>('');
  const [localPassword, setLocalPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const validateFields = (): boolean => {
    let isValid = true;

    if (!localEmail) {
      setEmailError('Email не может быть пустым');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!localPassword) {
      setPasswordError('Пароль не может быть пустым');
      isValid = false;
    } else if (localPassword.length < 10) {
      setPasswordError('Пароль должен содержать не менее 10 символов');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateFields()) {
      setEmail(localEmail);
      setPassword(localPassword);
      console.log('Вход выполнен:', localEmail);
    } else {
      setSnackbarMessage('Пожалуйста, исправьте ошибки в форме');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography variant="h6" fontFamily="Inter" textAlign="center" color="#ddd">
        Войдите в аккаунт, чтобы получить возможность оценивать статьи и публиковать их!
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        variant="outlined"
        placeholder="Введите ваш email"
        error={!!emailError}
        helperText={emailError}
        onChange={(e) => setLocalEmail(e.target.value)}
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
        onChange={(e) => setLocalPassword(e.target.value)}
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
          '&:hover': { background: '#3A3A3A' },
        }}
        variant="contained"
      >
        Войти
      </Button>

      <Typography
        variant="body1"
        sx={{ fontFamily: 'Poppins', color: '#aaa', fontSize: '3vh', textAlign: 'center' }}
      >
        У вас нет аккаунта?
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
          '&:hover': { backgroundColor: '#3A3A3A' },
        }}
        variant="contained"
        onClick={() => navigate('/register')}
      >
        Зарегистрироваться
      </Button>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;