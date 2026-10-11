import { createContext, useEffect, useState } from 'react';
import { loadData, saveData } from './storage';

// Khởi tạo "kho lưu trữ" (Lesson 8: Context)
export const Store = createContext();

// Tài khoản mẫu để demo nhanh
const DEMO_USER = {
    id: 1,
    fullName: 'Nguyễn Văn A',
    email: 'demo@morent.com',
    password: '123456',
    phone: '0912345678',
    address: 'Hà Nội',
};

const StoreBoundary = (props) => {
    // ----- State -----
    // Lấy giá trị khởi tạo từ localStorage để F5 không bị mất dữ liệu
    const [users, setUsers] = useState(() => loadData('morent_users', [DEMO_USER]));
    const [currentUser, setCurrentUser] = useState(() => loadData('morent_current_user', null));
    const [favorites, setFavorites] = useState(() => loadData('morent_favorites', {}));
    const [orders, setOrders] = useState(() => loadData('morent_orders', []));
    const [reviews, setReviews] = useState(() => loadData('morent_reviews', []));

    // ----- Side effect: lưu lại mỗi khi dữ liệu thay đổi (Lesson 7: useEffect) -----
    useEffect(() => saveData('morent_users', users), [users]);
    useEffect(() => saveData('morent_current_user', currentUser), [currentUser]);
    useEffect(() => saveData('morent_favorites', favorites), [favorites]);
    useEffect(() => saveData('morent_orders', orders), [orders]);
    useEffect(() => saveData('morent_reviews', reviews), [reviews]);

    // ----- Xử lý tài khoản -----
    const handleRegister = (data) => {
        const existed = users.find((u) => u.email === data.email);
        if (existed) {
            return { success: false, message: 'Email này đã được đăng ký!' };
        }
        const newUser = { id: Date.now(), phone: '', address: '', ...data };
        setUsers([...users, newUser]);
        return { success: true };
    };

    const handleLogin = (email, password) => {
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) {
            return { success: false, message: 'Email hoặc mật khẩu không đúng!' };
        }
        setCurrentUser(user);
        return { success: true };
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleUpdateAccount = (data) => {
        const updated = { ...currentUser, ...data };
        setCurrentUser(updated);
        setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
    };

    // ----- Xử lý yêu thích (lưu theo email của từng người dùng) -----
    const userFavorites = currentUser ? favorites[currentUser.email] || [] : [];

    const handleToggleFavorite = (carId) => {
        if (!currentUser) return false;
        const list = favorites[currentUser.email] || [];
        const newList = list.includes(carId)
            ? list.filter((id) => id !== carId)
            : [...list, carId];
        setFavorites({ ...favorites, [currentUser.email]: newList });
        return true;
    };

    // ----- Xử lý đơn hàng -----
    const userOrders = currentUser ? orders.filter((o) => o.userEmail === currentUser.email) : [];

    const handleAddOrder = (order) => {
        const newOrder = {
            ...order,
            id: 'MR' + Date.now().toString().slice(-6),
            userEmail: currentUser.email,
            createdAt: new Date().toISOString(),
            cancelled: false,
        };
        setOrders([newOrder, ...orders]);
        return newOrder;
    };

    const handleCancelOrder = (orderId) => {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, cancelled: true } : o)));
    };

    // ----- Xử lý đánh giá -----
    const handleAddReview = (review) => {
        const newReview = {
            ...review,
            id: Date.now(),
            name: currentUser.fullName,
            role: 'Khách hàng Morent',
            date: new Date().toISOString().slice(0, 10),
        };
        setReviews([newReview, ...reviews]);
    };

    // Giá trị cung cấp cho toàn bộ ứng dụng: mỗi dữ liệu gồm value + các hàm handle
    const contextValue = {
        auth: {
            value: currentUser,
            login: handleLogin,
            logout: handleLogout,
            register: handleRegister,
            update: handleUpdateAccount,
        },
        favorites: {
            value: userFavorites,
            toggle: handleToggleFavorite,
        },
        orders: {
            value: userOrders,
            add: handleAddOrder,
            cancel: handleCancelOrder,
        },
        reviews: {
            value: reviews,
            add: handleAddReview,
        },
    };

    return (
        <Store.Provider value={contextValue}>
            {props.children}
        </Store.Provider>
    );
};

export default StoreBoundary;
