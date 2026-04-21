import { Button, TextField, Typography } from '@mui/material';
import React, { JSX } from 'react';
import { IPropsRegister } from '../../../common/types/auth';

const RegisterPage: React.FC<IPropsRegister> = (props: IPropsRegister): JSX.Element => {
  const {setEmail, setPassword, setRetryPassword, setUserName, navigate} = props 

  return (
    <>
      <Typography variant="h6" fontFamily='Inter' textAlign='center'>Зарегистрируйтесь на нашем сайте, чтобы получить возможность оценивать статьи и публиковать их!</Typography>
      <TextField fullWidth={true} margin='normal' label="Email" variant="outlined" placeholder='Введите ваш email' onChange={(e) => setEmail(e.target.value)}/>
      <TextField fullWidth={true} margin='normal' label="Username" variant="outlined" placeholder='Введите ваш Username' onChange={(e) => setUserName(e.target.value)}/>
      <TextField type='password' fullWidth={true} margin='normal' label="Password" variant="outlined" placeholder='Введите ваш пароль' onChange={(e) => setPassword(e.target.value)}/>
      <TextField type='password' fullWidth={true} margin='normal' label="Retry Password" variant="outlined" placeholder='Повторите ваш пароль' onChange={(e) => setRetryPassword(e.target.value)}/>
      <Button type='submit' sx={{fontFamily:'Inter', marginTop:1.5, width:'65%', marginBottom:2, background:'#0E0F15', borderRadius:'15px'}} variant="contained">Регистрация</Button>
      <Typography variant="body1" sx={{fontFamily:'poppins', color:'#717070', fontSize:'3vh'}}>У вас уже есть аккаунт??</Typography>
      <Button type='submit' sx={{fontFamily:'Inter', marginTop:1.5, width:'65%', backgroundColor: 'transparent', borderRadius:'15px', borderColor:'#0E0F15', color:'#0E0F15'}} variant="contained" onClick={() => {navigate('/login')}}>Войти</Button>
    </>
  );
}

export default RegisterPage;