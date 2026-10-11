import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, Button, Form, Input, message, Select, Tabs } from 'antd';
import { Store } from '../../store';
import { LOCATIONS } from '../../utils/format';

// Trang quản lý tài khoản cá nhân (CTM-ACC01)
const Account = () => {
    const store = useContext(Store);
    const navigate = useNavigate();
    const user = store.auth.value;
    const [passwordForm] = Form.useForm();

    const handleUpdateInfo = (values) => {
        store.auth.update(values);
        message.success('Cập nhật thông tin thành công!');
    };

    const handleChangePassword = (values) => {
        if (values.oldPassword !== user.password) {
            message.error('Mật khẩu hiện tại không đúng!');
            return;
        }
        store.auth.update({ password: values.newPassword });
        passwordForm.resetFields();
        message.success('Đổi mật khẩu thành công!');
    };

    const infoTab = (
        <Form layout="vertical" initialValues={user} onFinish={handleUpdateInfo} className="max-w-xl">
            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Hãy nhập họ tên!' }]}>
                <Input size="large" />
            </Form.Item>
            <Form.Item name="email" label="Email">
                <Input size="large" disabled />
            </Form.Item>
            <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ pattern: /^0\d{9}$/, message: 'Số điện thoại gồm 10 số, bắt đầu bằng 0' }]}
            >
                <Input size="large" placeholder="0912345678" />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
                <Select size="large" placeholder="Chọn thành phố" options={LOCATIONS} allowClear />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large">Lưu thay đổi</Button>
        </Form>
    );

    const passwordTab = (
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword} className="max-w-xl">
            <Form.Item name="oldPassword" label="Mật khẩu hiện tại" rules={[{ required: true, message: 'Hãy nhập mật khẩu hiện tại!' }]}>
                <Input.Password size="large" />
            </Form.Item>
            <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                    { required: true, message: 'Hãy nhập mật khẩu mới!' },
                    { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                ]}
            >
                <Input.Password size="large" />
            </Form.Item>
            <Form.Item
                name="confirm"
                label="Xác nhận mật khẩu mới"
                dependencies={['newPassword']}
                rules={[
                    { required: true, message: 'Hãy nhập lại mật khẩu!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                    }),
                ]}
            >
                <Input.Password size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large">Đổi mật khẩu</Button>
        </Form>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            <aside className="w-full lg:w-72 bg-white rounded-xl p-6 flex flex-col items-center text-center">
                <Avatar size={88} style={{ backgroundColor: '#3563E9', fontSize: 36 }}>
                    {user.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <h2 className="text-xl font-bold mt-4">{user.fullName}</h2>
                <p className="text-secondary">{user.email}</p>
                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                    <div className="bg-light rounded-lg p-3">
                        <p className="text-xl font-bold">{store.orders.value.length}</p>
                        <p className="text-secondary text-xs">Đơn thuê</p>
                    </div>
                    <div className="bg-light rounded-lg p-3">
                        <p className="text-xl font-bold">{store.favorites.value.length}</p>
                        <p className="text-secondary text-xs">Yêu thích</p>
                    </div>
                </div>
                <Button block className="mt-6" onClick={() => navigate('/orders')}>Xem lịch sử đặt xe</Button>
            </aside>

            <div className="flex-1 w-full bg-white rounded-xl p-6">
                <h1 className="text-2xl font-bold mb-4">Tài khoản của tôi</h1>
                <Tabs
                    items={[
                        { key: 'info', label: 'Thông tin cá nhân', children: infoTab },
                        { key: 'password', label: 'Đổi mật khẩu', children: passwordTab },
                    ]}
                />
            </div>
        </div>
    );
};

export default Account;
