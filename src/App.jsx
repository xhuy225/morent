import { Route, Routes } from 'react-router';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './screens/Home';
import Cars from './screens/Cars';
import CarDetail from './screens/CarDetail';
import Booking from './screens/Booking';
import Orders from './screens/Orders';
import Favorites from './screens/Favorites';
import Account from './screens/Account';
import Login from './screens/Login';
import Register from './screens/Register';
import NotFound from './screens/NotFound';

function App() {
  return (
    <Routes>
      {/* Nested Route: các trang con hiển thị trong <Outlet /> của MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="cars" element={<Cars />} />
        {/* URL params: /cars/1, /cars/2 ... */}
        <Route path="cars/:carId" element={<CarDetail />} />

        {/* Các trang yêu cầu đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path="booking/:carId" element={<Booking />} />
          <Route path="orders" element={<Orders />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="account" element={<Account />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Trang đăng nhập / đăng ký không dùng chung layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
