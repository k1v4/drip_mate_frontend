import { Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import React, { JSX, useState } from 'react';
import { IPropsRegister } from '../../../common/types/auth';

// RegisterPage не делает fetch — только рендерит форму и валидирует
// Сабмит обрабатывается в AuthRootComponent через onSubmit формы
const RegisterPage: React.FC<IPropsRegister> = (props: IPropsRegister): JSX.Element => {
  const { setEmail, setPassword, setRetryPassword, setUserName, navigate } = props;

  const [localEmail, setLocalEmail] = useState<string>('');
  const [localPassword, setLocalPassword] = useState<string>('');
  const [localRetry, setLocalRetry] = useState<string>('');

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [retryError, setRetryError] = useState<string>('');

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

    if (localPassword !== localRetry) {
      setRetryError('Пароли не совпадают');
      isValid = false;
    } else {
      setRetryError('');
    }

    return isValid;
  };

  const handleBeforeSubmit = (e: React.FormEvent) => {
    if (!validateFields()) {
      e.preventDefault();
      setSnackbarMessage('Пожалуйста, исправьте ошибки в форме');
      setOpenSnackbar(true);
    }
    // иначе всплывает до AuthRootComponent.handleSubmit
  };

  return (
    <>
      <Typography variant="h6" fontFamily="Inter" textAlign="center" color="#ddd">
        Зарегистрируйтесь на нашем сайте, чтобы получить возможность стать сваговей!
      </Typography>

      <TextField
        fullWidth margin="normal" label="Email" variant="outlined"
        placeholder="Введите ваш email"
        error={!!emailError} helperText={emailError}
        onChange={(e) => { setLocalEmail(e.target.value); setEmail(e.target.value); }}
      />

      <TextField
        type="password" fullWidth margin="normal" label="Password" variant="outlined"
        placeholder="Введите ваш пароль"
        error={!!passwordError} helperText={passwordError}
        onChange={(e) => { setLocalPassword(e.target.value); setPassword(e.target.value); }}
      />

      <TextField
        type="password" fullWidth margin="normal" label="Retry Password" variant="outlined"
        placeholder="Повторите ваш пароль"
        error={!!retryError} helperText={retryError}
        onChange={(e) => { setLocalRetry(e.target.value); setRetryPassword(e.target.value); }}
      />

      <Button
        type="submit"
        onClick={handleBeforeSubmit}
        sx={{
          fontFamily: 'Inter', marginTop: 1.5, width: '65%', marginBottom: 2,
          background: '#2B2B2B', borderRadius: '15px', color: '#fff',
          '&:hover': { background: '#3A3A3A' },
        }}
        variant="contained"
      >
        Регистрация
      </Button>

      <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: '#aaa', fontSize: '3vh', textAlign: 'center' }}>
        У вас уже есть аккаунт?
      </Typography>

      <Button
        type="button"
        sx={{
          fontFamily: 'Inter', marginTop: 1.5, width: '65%',
          backgroundColor: '#2B2B2B', borderRadius: '15px', color: '#fff',
          border: '1px solid #444', '&:hover': { backgroundColor: '#3A3A3A' },
        }}
        variant="contained"
        onClick={() => navigate('/login')}
      >
        Войти
      </Button>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterPage;