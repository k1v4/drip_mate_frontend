import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/router/privateRoute';
import PublicRoute from './utils/router/publicRoute';
import AuthRootComponent from './components/auth';
import Profile from './components/profile';
import SelectResult from './components/select_result';
import Onboarding from './components/onboarding';

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Открытые роуты — если залогинен, редиректят на / */}
        <Route element={<PublicRoute />}>
          <Route path='login'    element={<AuthRootComponent />} />
          <Route path='register' element={<AuthRootComponent />} />
        </Route>

        {/* Закрытые роуты */}
        <Route element={<PrivateRoute />}>
          <Route path='/'            element={<Profile />} />
          <Route path='onboarding'   element={<Onboarding />} />
          <Route path='outfit'       element={<SelectResult />} />
          <Route path='outfit/:id'   element={<SelectResult />} />
        </Route>

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  );
}

export default App;