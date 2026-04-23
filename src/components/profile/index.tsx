import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import Personal from './personal';
import Selection from './collection';
import Outfits from './articles';
import AddReleaseForm from './add_release';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState('selection');
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
      case 'selection':
        return <Selection />;
      case 'myOutfits':
        return <Outfits />;
      case 'add_item':
        return accessId === 2 ? <AddReleaseForm /> : null; // Показываем только для access_id = 2
      default:
        return <div>Другой раздел</div>;
    }
  };

  return (
    <div className='profileRoot'>
      <header>
        <h1 className='logo-profile' onClick={() => navigate('/')}>
          DRIP MATE
        </h1>
        <div className='switch-buttons'>
            <div className='input-container'>
              <input id='selection' type='radio' name='radio' checked={selectedButton === 'selection'} onChange={handleChange} />
              <div className='radio-tile'>
                <label htmlFor='selection'>Подбор</label>
              </div>
            </div>

            <div className='input-container'>
              <input id='myOutfits' type='radio' name='radio' checked={selectedButton === 'myOutfits'} onChange={handleChange} />
              <div className='radio-tile'>
                <label htmlFor='myOutfits'>Сохраненные образы</label>
              </div>
            </div>

            <div className='radio-tile-group'>
              <div className='input-container'>
                <input id='profile' type='radio' name='radio' checked={selectedButton === 'profile'} onChange={handleChange} />
                <div className='radio-tile'>
                  <label htmlFor='profile'>Профиль</label>
                </div>
            </div>

            {/* Показываем "Добавить релиз" только для access_id = 2 */}
            {accessId === 2 && (
              <div className='input-container'>
                <input id='add_item' type='radio' name='radio' checked={selectedButton === 'add_item'} onChange={handleChange} />
                <div className='radio-tile'>
                  <label htmlFor='add_item'>Добавить предмет</label>
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