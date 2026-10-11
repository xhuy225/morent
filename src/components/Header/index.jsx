import { useContext, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { Avatar, Badge, Button, Drawer, Dropdown, Input, Tooltip } from 'antd';
import {
    SearchOutlined, HeartOutlined, FileTextOutlined, UserOutlined,
    LogoutOutlined, MenuOutlined,
} from '@ant-design/icons';
import { Store } from '../../store';

const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/cars', label: 'Thuê xe' },
    { to: '/orders', label: 'Đơn của tôi' },
    { to: '/favorites', label: 'Yêu thích' },
];

const Header = () => {
    const store = useContext(Store);
    const navigate = useNavigate();
    const user = store.auth.value;
    const [openMenu, setOpenMenu] = useState(false);
    // useRef: lấy giá trị ô tìm kiếm mà không cần tạo state (Lesson 10)
    const searchRef = useRef(null);

    const handleSearch = () => {
        const keyword = searchRef.current.input.value.trim();
        // Search params: /cars?search=... (Lesson 9)
        navigate(keyword ? `/cars?search=${encodeURIComponent(keyword)}` : '/cars');
    };

    const handleLogout = () => {
        store.auth.logout();
        navigate('/');
    };

    const userMenu = {
        items: [
            { key: 'account', icon: <UserOutlined />, label: 'Tài khoản của tôi' },
            { key: 'orders', icon: <FileTextOutlined />, label: 'Lịch sử đặt xe' },
            { key: 'favorites', icon: <HeartOutlined />, label: 'Xe yêu thích' },
            { type: 'divider' },
            { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
        ],
        onClick: ({ key }) => {
            if (key === 'logout') handleLogout();
            else navigate(`/${key}`);
        },
    };

    const navClass = ({ isActive }) =>
        `font-semibold text-sm ${isActive ? 'text-primary' : 'text-dark hover:text-primary'}`;

    return (
        <header className="bg-white border-b border-solid border-[#C3D4E966] border-x-0 border-t-0 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center gap-6">
                <Link to="/" className="text-primary text-3xl font-extrabold tracking-tight">
                    MORENT
                </Link>

                <div className="hidden md:block flex-1 max-w-md">
                    <Input
                        ref={searchRef}
                        size="large"
                        allowClear
                        prefix={<SearchOutlined className="text-secondary" />}
                        placeholder="Tìm kiếm xe theo tên..."
                        onPressEnter={handleSearch}
                        className="rounded-full"
                    />
                </div>

                <nav className="hidden lg:flex gap-6 ml-auto">
                    {navLinks.map((item) => (
                        <NavLink key={item.to} to={item.to} end className={navClass}>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3 ml-auto lg:ml-0">
                    {user ? (
                        <>
                            <Tooltip title="Xe yêu thích">
                                <Badge count={store.favorites.value.length} size="small">
                                    <Button shape="circle" icon={<HeartOutlined />} onClick={() => navigate('/favorites')} />
                                </Badge>
                            </Tooltip>
                            <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
                                <Avatar className="cursor-pointer" style={{ backgroundColor: '#3563E9' }}>
                                    {user.fullName.charAt(0).toUpperCase()}
                                </Avatar>
                            </Dropdown>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
                            <Button type="primary" className="hidden sm:inline-flex" onClick={() => navigate('/register')}>
                                Đăng ký
                            </Button>
                        </>
                    )}
                    <Button className="lg:hidden" icon={<MenuOutlined />} onClick={() => setOpenMenu(true)} />
                </div>
            </div>

            {/* Drawer: menu cho màn hình nhỏ (Lesson 5) */}
            <Drawer title="MORENT" placement="right" open={openMenu} onClose={() => setOpenMenu(false)} width={280}>
                <Input.Search
                    placeholder="Tìm kiếm xe..."
                    onSearch={(value) => {
                        setOpenMenu(false);
                        navigate(value ? `/cars?search=${encodeURIComponent(value)}` : '/cars');
                    }}
                    className="mb-6"
                />
                <div className="flex flex-col gap-4">
                    {navLinks.map((item) => (
                        <NavLink key={item.to} to={item.to} end className={navClass} onClick={() => setOpenMenu(false)}>
                            {item.label}
                        </NavLink>
                    ))}
                    {user && (
                        <NavLink to="/account" className={navClass} onClick={() => setOpenMenu(false)}>
                            Tài khoản
                        </NavLink>
                    )}
                </div>
            </Drawer>
        </header>
    );
};

export default Header;
