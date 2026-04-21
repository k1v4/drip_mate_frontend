import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import Personal from './personal';
import Collection from './collection';
import Articles from './articles';
import Calendar from './calendar';
import DeleteProfile from './delete';
import AddReleaseForm from './add_release';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState('profile');
  const [accessId, setAccessId] = useState<number | null>(null);

  // Получаем access_id из localStorage
  useEffect(() => {
    const accessIdFromStorage = localStorage.getItem('access_id');
    if (accessIdFromStorage) {
      setAccessId(Number(accessIdFromStorage));
    }
  }, []);

  useEffect(() => {
    if (location.state?.selectedTab) {
      setSelectedButton(location.state.selectedTab);
    }
  }, [location.state]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Выбрана кнопка:', event.target.id);
    setSelectedButton(event.target.id);
  };

  const renderContent = () => {
    switch (selectedButton) {
      case 'profile':
        return <Personal />;
      case 'collection':
        return <Collection />;
      case 'myArticles':
        return <Articles />;
      case 'calendar':
        return <Calendar />;
      case 'delete':
        return <DeleteProfile />;
      case 'add_release':
        return accessId === 2 ? <AddReleaseForm /> : null; // Показываем только для access_id = 2
      default:
        return <div>Другой раздел</div>;
    }
  };

  return (
    <div className='profileRoot'>
      <header>
        <h1 className='logo-profile' onClick={() => navigate('/')}>
          CREPS HUB
        </h1>
        <div className='switch-buttons'>
          <div className='radio-tile-group'>
            <div className='input-container'>
              <input id='profile' type='radio' name='radio' checked={selectedButton === 'profile'} onChange={handleChange} />
              <div className='radio-tile'>
                <label htmlFor='profile'>Профиль</label>
              </div>
            </div>

            <div className='input-container'>
              <input id='collection' type='radio' name='radio' checked={selectedButton === 'collection'} onChange={handleChange} />
              <div className='radio-tile'>
                <label htmlFor='collection'>Коллекция</label>
              </div>
            </div>

            <div className='input-container'>
              <input id='myArticles' type='radio' name='radio' checked={selectedButton === 'myArticles'} onChange={handleChange} />
              <div className='radio-tile'>
                <label htmlFor='myArticles'>Мои статьи</label>
              </div>
            </div>

            <div className='input-container'>
              <input id='calendar' type='radio' name='radio' checked={selectedButton === 'calendar'} onChange={handleChange} />
              <div className='radio-tile'>
                <label htmlFor='calendar'>Календарь релизов</label>
              </div>
            </div>

            <div className='input-container'>
              <input id='delete' type='radio' name='radio' checked={selectedButton === 'delete'} onChange={handleChange} />
              <div className='radio-tile'>
                <label htmlFor='delete'>Удалить Профиль</label>
              </div>
            </div>

            {/* Показываем "Добавить релиз" только для access_id = 2 */}
            {accessId === 2 && (
              <div className='input-container'>
                <input id='add_release' type='radio' name='radio' checked={selectedButton === 'add_release'} onChange={handleChange} />
                <div className='radio-tile'>
                  <label htmlFor='add_release'>Добавить релиз</label>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className='main'>
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;