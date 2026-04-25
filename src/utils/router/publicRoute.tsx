import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hook';

const PublicRoute = () => {
    const isLogged = useAuth();
    return isLogged ? <Navigate to='/' replace /> : <Outlet />;
};

export default PublicRoute;