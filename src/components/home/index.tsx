import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import './style.scss';
import Add from '@mui/icons-material/Add';

const MainHome = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className='homeRoot'>
            <header>
                <h1 className='logo' onClick={() => navigate('/')}>DRIP MATE</h1>
                <div className='buttons'>
                    <Button
                        variant="contained"
                        sx={{ background: 'white', color: '#0E0F15', borderRadius: '15px' }}
                        endIcon={<Add />}
                        onClick={() => navigate('/profile', { state: { selectedTab: 'myOutfits' } })}
                    >
                        Опубликовать статью
                    </Button>
                    <IconButton aria-label="profile" sx={{ color: 'white' }} onClick={() => navigate('/profile')}>
                        <AccountCircle fontSize='large' />
                    </IconButton>
                </div>
            </header>
            <div className='main'>
            </div>
            <footer>
                <h1>DRIP MATE</h1>
            </footer>
        </div>
    );
};

export default MainHome;
