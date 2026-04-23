import { Box, Button, TextField } from '@mui/material';
import React, { JSX, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

const Personal: React.FC = (): JSX.Element => {
  const { getTokens } = useAuth();
  const tokens = getTokens();

  // 🔹 профиль
  const [profileData, setProfileData] = useState({
    username: '',
    name: '',
    surname: '',
    city: '',
    email: '',
  });

  // 🔹 безопасность
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // ===== handlers =====

  const handleDeleteProfile = async () => {
  const confirmed = window.confirm('Вы уверены, что хотите удалить профиль? Это действие необратимо.');

  if (!confirmed) return;

  if (!tokens?.accessToken) {
    alert('Пользователь не авторизован');
    return;
  }

  try {
    await axios.delete('http://localhost:8080/api/v1/users', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    alert('Профиль удалён');

    // 👉 здесь логично разлогинить пользователя
    window.location.href = '/login';
  } catch (error) {
    console.error(error);
    alert('Ошибка удаления профиля');
  }
};

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // ===== submit профиль =====

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokens?.accessToken) {
      alert('Пользователь не авторизован');
      return;
    }

    try {
      await axios.put(
        'http://localhost:8080/api/v1/users/profile',
        profileData,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Профиль обновлён');
    } catch (error) {
      console.error(error);
      alert('Ошибка обновления профиля');
    }
  };

  // ===== submit пароль =====

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokens?.accessToken) {
      alert('Пользователь не авторизован');
      return;
    }

    // 🔴 валидация
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Пароль должен быть не менее 6 символов');
      return;
    }

    try {
      await axios.put(
        'http://localhost:8080/api/v1/users/password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Пароль обновлён');

      // очистка формы
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error(error);
      alert('Ошибка смены пароля');
    }
  };

  return (
    <div className='personalMain'>

      {/* ===== ПРОФИЛЬ ===== */}
      <form className="formPersonal" onSubmit={handleProfileSubmit}>
        <Box
          display='flex'
          flexDirection='column'
          maxWidth='55%'
          margin='auto'
          padding='2% 5%'
          borderRadius={5}
          bgcolor='#F9F8F3'
        >
          <h2>Профиль</h2>

          <div className="userInfo">
            <TextField
              name="username"
              label="Username"
              fullWidth
              value={profileData.username}
              onChange={handleProfileChange}
            />

            <TextField
              name="name"
              label="Имя"
              fullWidth
              value={profileData.name}
              onChange={handleProfileChange}
            />

            <TextField
              name="surname"
              label="Фамилия"
              fullWidth
              value={profileData.surname}
              onChange={handleProfileChange}
            />

            <TextField
              name="city"
              label="Город"
              fullWidth
              value={profileData.city}
              onChange={handleProfileChange}
            />

            <TextField
              name="email"
              label="Email"
              fullWidth
              value={profileData.email}
              onChange={handleProfileChange}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: '#0E0F15',
              color: '#F9F8F3',
            }}
          >
            Сохранить профиль
          </Button>
        </Box>
      </form>

      {/* ===== БЕЗОПАСНОСТЬ ===== */}
      <form className="formPersonal" onSubmit={handlePasswordSubmit}>
        <Box
          display='flex'
          flexDirection='column'
          maxWidth='55%'
          margin='auto'
          padding='2% 5%'
          borderRadius={5}
          bgcolor='#F9F8F3'
          marginTop={3}
        >
          <h2>Безопасность</h2>

          <div className="passwordInfo">
            <TextField
              type="password"
              name="currentPassword"
              label="Текущий пароль"
              fullWidth
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="passwordInfo">
            <TextField
              type="password"
              name="newPassword"
              label="Новый пароль"
              fullWidth
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="passwordInfo">
            <TextField
              type="password"
              name="confirmPassword"
              label="Повторите новый пароль"
              fullWidth
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: '#0E0F15',
              color: '#F9F8F3',
            }}
          >
            Сменить пароль
          </Button>
        </Box>
      </form>

            <Box
        display='flex'
        justifyContent='center'
        marginTop={5}
        marginBottom={5}
      >
        <Button
          variant="contained"
          onClick={handleDeleteProfile}
          sx={{
            backgroundColor: '#ff4d4f',
            color: '#fff',
            borderRadius: '12px',
            padding: '10px 24px',

            '&:hover': {
              backgroundColor: '#d9363e',
            },
          }}
        >
          Удалить профиль
        </Button>
      </Box>
    </div>
  );
};

export default Personal;