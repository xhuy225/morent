import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Store } from '../../store';

// Protected Route: chưa đăng nhập thì chuyển về trang /login (Lesson 9)
const ProtectedRoute = () => {
    const store = useContext(Store);
    const location = useLocation();

    if (!store.auth.value) {
        // Lưu lại trang đang muốn vào, đăng nhập xong sẽ quay lại trang đó
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
