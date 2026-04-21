import { Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import React, { JSX, useState } from 'react';
import { IPropsLogin } from '../../../common/types/auth';

const LoginPage: React.FC<IPropsLogin> = (props: IPropsLogin): JSX.Element => {
  const { setEmail, setPassword, navigate } = props;

  // Локальное состояние для email и password
  const [localEmail, setLocalEmail] = useState<string>('');
  const [localPassword, setLocalPassword] = useState<string>('');

  // Состояния для ошибок валидации
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // Валидация полей
  const validateFields = (): boolean => {
    let isValid = true;

    // Валидация email
    if (!localEmail) {
      setEmailError('Email не может быть пустым');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Валидация пароля
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

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateFields()) {
      // Если валидация прошла успешно, обновляем значения в пропсах
      setEmail(localEmail);
      setPassword(localPassword);

      console.log('Вход выполнен:', localEmail);
    } else {
      setSnackbarMessage('Пожалуйста, исправьте ошибки в форме');
      setOpenSnackbar(true);
    }
  };

  // Закрытие Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography variant="h6" fontFamily='Inter' textAlign='center'>Войдите в аккаунт, чтобы получить возможность оценивать статьи и публиковать их!</Typography>
      <TextField fullWidth={true} margin='normal' label="Email" variant="outlined" placeholder='Введите ваш email' onChange={(e) => setEmail(e.target.value)}/>
      <TextField type='password' fullWidth={true} margin='normal' label="Password" variant="outlined" placeholder='Введите ваш пароль' onChange={(e) => setPassword(e.target.value)}/>
      <Button type='submit' sx={{fontFamily:'Inter', marginTop:1.5, width:'65%', marginBottom:2, background:'#0E0F15', borderRadius:'15px'}} variant="contained">Войти</Button>
      <Typography variant="body1" sx={{fontFamily:'poppins', color:'#717070', fontSize:'3vh'}}>У вас нет аккаунта?</Typography>
      <Button type='submit' sx={{fontFamily:'Inter', marginTop:1.5, width:'65%', backgroundColor: 'transparent', borderRadius:'15px', borderColor:'#0E0F15', color:'#0E0F15'}} variant="contained" onClick={() => {navigate('/register')}}>Зарегистрироваться</Button>
    </>
  );
};

export default LoginPage;