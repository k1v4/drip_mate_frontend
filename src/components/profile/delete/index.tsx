import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../../../context/AuthContext'; // Импортируем useAuth для получения токена
import { useNavigate } from 'react-router-dom'; // Для перенаправления после удаления

const DeleteProfile = () => {
  const { getTokens, logout } = useAuth(); // Получаем токены и функцию logout из контекста
  const navigate = useNavigate(); // Для перенаправления

  // Функция для удаления профиля
  const handleDeleteProfile = async () => {
    const tokens = getTokens();
    if (!tokens?.accessToken) {
      alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`, // Добавляем JWT-токен
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении профиля');
      }

      // Если удаление прошло успешно
      alert('Профиль успешно удалён');
      logout(); // Выход из системы (очистка токенов)
      navigate('/register'); // Перенаправляем пользователя на страницу регистрации
    } catch (error) {
      console.error('Ошибка при удалении профиля:', error);
      alert('Произошла ошибка при удалении профиля.');
    }
  };

  return (
    <div className='deleteDiv' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Button className='deleteButton' onClick={handleDeleteProfile}>
        Удалить профиль
      </Button>
    </div>
  );
};

export default DeleteProfile;