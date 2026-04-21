import { Button, TextField, Typography } from '@mui/material';
import React, { JSX } from 'react';
import { IPropsRegister } from '../../../common/types/auth';

const RegisterPage: React.FC<IPropsRegister> = (props: IPropsRegister): JSX.Element => {
  const { setEmail, setPassword, setRetryPassword, setUserName, navigate } = props;

  return (
    <>
      <Typography variant="h6" fontFamily='Inter' textAlign='center' color="#ddd">
        Зарегистрируйтесь на нашем сайте, чтобы получить возможность оценивать статьи и публиковать их!
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        variant="outlined"
        placeholder="Введите ваш email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        type="password"
        fullWidth
        margin="normal"
        label="Password"
        variant="outlined"
        placeholder="Введите ваш пароль"
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        type="password"
        fullWidth
        margin="normal"
        label="Retry Password"
        variant="outlined"
        placeholder="Повторите ваш пароль"
        onChange={(e) => setRetryPassword(e.target.value)}
      />

      <Button
        type="submit"
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
          fontFamily: 'poppins',
          color: '#aaa',
          fontSize: '3vh',
          textAlign: 'center',
        }}
      >
        У вас уже есть аккаунт??
      </Typography>

      <Button
        type='button'
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
    </>
  );
};

export default RegisterPage;