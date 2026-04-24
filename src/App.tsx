import React from 'react';
import MainHome from './components/home';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/router/privateRoute';
import AuthRootComponent from './components/auth';
import Profile from './components/profile';
import SelectResult from './components/select_result';
import Onboarding from './components/onboarding';
import CatalogList from './components/profile/catalog';



function App() {
  return (  
    <div className="app">
      <Routes>
        <Route element={<PrivateRoute />}>
        </Route>
        {/* <Route path='/' element={<MainHome />}/> */}
        <Route path='onboarding' element={<Onboarding />} />
        <Route path='outfit' element={<SelectResult />}/>
        <Route path='outfit/:id' element={<SelectResult />}/>
        <Route path='/' element={<Profile />}/>
        <Route path='login' element={<AuthRootComponent />}/>
        <Route path='register' element={<AuthRootComponent />}/>
      </Routes>
    </div>
  );
}

export default App;
