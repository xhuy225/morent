import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Alert, Button, Checkbox, Form, Input, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import CarImage from '../../components/CarImage';
import { Store } from '../../store';

// Khung chung cho trang Đăng nhập / Đăng ký
export const AuthLayout = ({ title, subtitle, children }) => (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-12" style={{ background: 'linear-gradient(135deg,#54A6FF,#3563E9)' }}>
            <Link to="/" className="text-white text-3xl font-extrabold">MORENT</Link>
            <div>
                <h2 className="text-white text-4xl font-semibold leading-tight">Thuê xe dễ dàng,<br />an toàn và tiết kiệm.</h2>
                <CarImage color="#E8E8E8" className="w-4/5 mt-10" />
            </div>
            <p className="text-white/80 text-sm">©2026 MORENT</p>
        </div>
        <div className="flex items-center justify-center p-6 bg-light">
            <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-sm">
                <Link to="/" className="lg:hidden text-primary text-2xl font-extrabold">MORENT</Link>
                <h1 className="text-2xl font-bold mt-2">{title}</h1>
                <p className="text-secondary mt-2 mb-6">{subtitle}</p>
                {children}
            </div>
        </div>
    </div>
);

// Trang đăng nhập (CTM-LOG01)
const Login = () => {
    const store = useContext(Store);
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Trang người dùng muốn vào trước khi bị chuyển sang /login
    const redirectTo = location.state?.from || '/';

    const onFinish = async (values) => {
        setLoading(true);
        setError('');
        // Giả lập gọi API đăng nhập
        await new Promise((resolve) => setTimeout(resolve, 500));
        const result = store.auth.login(values.email, values.password);
        setLoading(false);
        if (!result.success) {
            setError(result.message);
            return;
        }
        message.success('Đăng nhập thành công!');
        // useNavigate: tự chuyển trang sau khi đăng nhập (Lesson 9)
        navigate(redirectTo, { replace: true });
    };

    return (
        <AuthLayout title="Đăng nhập" subtitle="Chào mừng trở lại! Hãy nhập thông tin để đăng nhập.">
            <Alert
                type="info"
                showIcon
                className="mb-5"
                message="Tài khoản demo: demo@morent.com / 123456"
            />
            {error && <Alert type="error" showIcon className="mb-5" message={error} />}
            <Form layout="vertical" onFinish={onFinish} requiredMark={false} initialValues={{ remember: true }}>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Hãy nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                >
                    <Input size="large" prefix={<MailOutlined />} placeholder="email@example.com" />
                </Form.Item>
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}>
                    <Input.Password size="large" prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>
                <div className="flex justify-between items-center mb-6">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <a className="text-primary" onClick={() => message.info('Tính năng đang phát triển')}>Quên mật khẩu?</a>
                </div>
                <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                    Đăng nhập
                </Button>
            </Form>
            <p className="text-center text-secondary mt-6">
                Chưa có tài khoản? <Link to="/register" className="text-primary font-semibold">Đăng ký ngay</Link>
            </p>
        </AuthLayout>
    );
};

export default Login;
