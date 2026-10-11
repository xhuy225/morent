import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Alert, Button, Checkbox, Form, Input, message } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { AuthLayout } from '../Login';
import { Store } from '../../store';

// Trang đăng ký tài khoản (CTM-REG01)
const Register = () => {
    const store = useContext(Store);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onFinish = (values) => {
        const result = store.auth.register({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
        });
        if (!result.success) {
            setError(result.message);
            return;
        }
        message.success('Đăng ký thành công! Hãy đăng nhập.');
        navigate('/login');
    };

    return (
        <AuthLayout title="Tạo tài khoản" subtitle="Đăng ký để bắt đầu thuê xe cùng Morent.">
            {error && <Alert type="error" showIcon className="mb-5" message={error} />}
            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
                <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[
                        { required: true, message: 'Hãy nhập họ tên!' },
                        { min: 3, message: 'Họ tên tối thiểu 3 ký tự' },
                    ]}
                >
                    <Input size="large" prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                </Form.Item>
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
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        { required: true, message: 'Hãy nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                    ]}
                    hasFeedback
                >
                    <Input.Password size="large" prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Hãy nhập lại mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) return Promise.resolve();
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                </Form.Item>
                <Form.Item
                    name="agree"
                    valuePropName="checked"
                    rules={[{
                        validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error('Bạn cần đồng ý với điều khoản!'))),
                    }]}
                >
                    <Checkbox>Tôi đồng ý với điều khoản sử dụng</Checkbox>
                </Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                    Đăng ký
                </Button>
            </Form>
            <p className="text-center text-secondary mt-6">
                Đã có tài khoản? <Link to="/login" className="text-primary font-semibold">Đăng nhập</Link>
            </p>
        </AuthLayout>
    );
};

export default Register;
