import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import Personal from './personal';
import Selection from './collection';
import Outfits from './articles';
import AddItemForm from './add_item';
import CatalogList from './catalog';
import { useAccessLevel } from '../../utils/hook';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState('selection');

  // Читаем уровень доступа из Redux вместо localStorage
  const accessLevel = useAccessLevel();
  const isAdmin = accessLevel === 2;

  useEffect(() => {
    if (location.state?.selectedTab) {
      setSelectedButton(location.state.selectedTab);
    }
  }, [location.state]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      case 'catalog':
        return isAdmin ? <CatalogList /> : null;
      case 'add_item':
        return isAdmin ? <AddItemForm /> : null;
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

            {isAdmin && (
              <div className='input-container'>
                <input id='add_item' type='radio' name='radio' checked={selectedButton === 'add_item'} onChange={handleChange} />
                <div className='radio-tile'>
                  <label htmlFor='add_item'>Добавить предмет</label>
                </div>
              </div>
            )}

            {isAdmin && (
              <div className='input-container'>
                <input id='catalog' type='radio' name='radio' checked={selectedButton === 'catalog'} onChange={handleChange} />
                <div className='radio-tile'>
                  <label htmlFor='catalog'>Каталог</label>
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