import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import './style.scss';
import Add from '@mui/icons-material/Add';
import { Box } from '@mui/material';
import Home from './homePage';
import GetArticlePage from './article';

const MainHome = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className='homeRoot'>
            <header>
                <h1 className='logo' onClick={() => navigate('/')}>CREPS HUB</h1>
                <div className='buttons'>
                    <Button
                        variant="contained"
                        sx={{ background: 'white', color: '#0E0F15', borderRadius: '15px' }}
                        endIcon={<Add />}
                        onClick={() => navigate('/profile', { state: { selectedTab: 'myArticles' } })}
                    >
                        Опубликовать статью
                    </Button>
                    <IconButton aria-label="profile" sx={{ color: 'white' }} onClick={() => navigate('/profile')}>
                        <AccountCircle fontSize='large' />
                    </IconButton>
                </div>
            </header>
            <div className='main'>
                <Box>
                    {location.pathname === '/' ? (
                      <Home />
                    ) : location.pathname.startsWith('/article/') ? (
                      <GetArticlePage navigate={navigate}/>
                    ) : null}
                </Box>
            </div>
            <footer>
                <h1>CREPS HUB</h1>
            </footer>
        </div>
    );
};

export default MainHome;
