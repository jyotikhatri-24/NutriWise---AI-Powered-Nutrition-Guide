import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constant';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();

    if (!user) {
        // Redirect to login with the current location
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
