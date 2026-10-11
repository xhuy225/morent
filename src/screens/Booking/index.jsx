import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
    Button, Checkbox, DatePicker, Divider, Form, Input, message, Modal, Radio, Result, Select, Skeleton,
} from 'antd';
import { CheckCircleFilled, SafetyCertificateOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CarImage from '../../components/CarImage';
import { getCarById } from '../../services/carService';
import { Store } from '../../store';
import { countDays, formatPrice, LOCATIONS } from '../../utils/format';

// Mã khuyến mãi demo
const PROMO_CODES = {
    MORENT10: 0.1,
    MINDX20: 0.2,
};
const TAX_RATE = 0.08;

// Khung bao mỗi bước thanh toán
const StepCard = ({ step, title, subtitle, children }) => (
    <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-secondary text-sm mt-1">{subtitle}</p>
            </div>
            <span className="text-secondary text-sm">Bước {step}/4</span>
        </div>
        {children}
    </div>
);

// Trang đặt xe và thanh toán (CTM-ORD01)
const Booking = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const store = useContext(Store);
    const user = store.auth.value;
    const [form] = Form.useForm();
    const promoRef = useRef(null);

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [discount, setDiscount] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [successOrder, setSuccessOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCarById(carId);
                setCar(data.car);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [carId]);

    // Theo dõi giá trị ngày nhận / trả trong form để tính tiền
    const pickupDate = Form.useWatch('pickupDate', form);
    const dropoffDate = Form.useWatch('dropoffDate', form);
    const paymentMethod = Form.useWatch('paymentMethod', form);

    // useMemo: tính tổng tiền chỉ khi các giá trị liên quan thay đổi
    const summary = useMemo(() => {
        if (!car) return null;
        const days = pickupDate && dropoffDate ? countDays(pickupDate, dropoffDate) : 1;
        const subtotal = car.price * days;
        const discountValue = subtotal * discount;
        const tax = (subtotal - discountValue) * TAX_RATE;
        return { days, subtotal, discountValue, tax, total: subtotal - discountValue + tax };
    }, [car, pickupDate, dropoffDate, discount]);

    const handleApplyPromo = () => {
        const code = promoRef.current.input.value.trim().toUpperCase();
        if (PROMO_CODES[code]) {
            setDiscount(PROMO_CODES[code]);
            message.success(`Áp dụng mã ${code} thành công: giảm ${PROMO_CODES[code] * 100}%`);
        } else {
            setDiscount(0);
            message.error('Mã khuyến mãi không hợp lệ');
        }
    };

    // Giả lập gửi đơn lên server (bất đồng bộ)
    const handleSubmit = async (values) => {
        setSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const order = store.orders.add({
            carId: car.id,
            carName: car.name,
            carType: car.type,
            carColor: car.color,
            pricePerDay: car.price,
            fullName: values.fullName,
            phone: values.phone,
            address: values.address,
            city: values.city,
            pickupLocation: values.pickupLocation,
            dropoffLocation: values.dropoffLocation,
            pickupDate: values.pickupDate.toISOString(),
            dropoffDate: values.dropoffDate.toISOString(),
            paymentMethod: values.paymentMethod,
            days: summary.days,
            total: Number(summary.total.toFixed(2)),
        });
        setSubmitting(false);
        setSuccessOrder(order);
    };

    if (loading) return <Skeleton active paragraph={{ rows: 12 }} />;
    if (!car) {
        return <Result status="404" title="Không tìm thấy xe" extra={<Button onClick={() => navigate('/cars')}>Quay lại</Button>} />;
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">
            <Form
                form={form}
                layout="vertical"
                className="flex-1 w-full flex flex-col gap-8"
                onFinish={handleSubmit}
                onFinishFailed={() => message.error('Vui lòng điền đầy đủ thông tin!')}
                initialValues={{
                    fullName: user.fullName,
                    phone: user.phone,
                    address: user.address,
                    paymentMethod: 'card',
                    pickupDate: dayjs().add(1, 'day').hour(9).minute(0),
                    dropoffDate: dayjs().add(3, 'day').hour(9).minute(0),
                }}
                requiredMark={false}
            >
                <StepCard step={1} title="Thông tin cá nhân" subtitle="Vui lòng nhập thông tin của bạn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Hãy nhập họ tên!' }]}>
                            <Input size="large" placeholder="Nguyễn Văn A" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Hãy nhập số điện thoại!' },
                                { pattern: /^0\d{9}$/, message: 'Số điện thoại gồm 10 số, bắt đầu bằng 0' },
                            ]}
                        >
                            <Input size="large" placeholder="0912345678" />
                        </Form.Item>
                        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Hãy nhập địa chỉ!' }]}>
                            <Input size="large" placeholder="Số nhà, đường..." />
                        </Form.Item>
                        <Form.Item name="city" label="Thành phố" rules={[{ required: true, message: 'Hãy chọn thành phố!' }]}>
                            <Select size="large" placeholder="Chọn thành phố" options={LOCATIONS} />
                        </Form.Item>
                    </div>
                </StepCard>

                <StepCard step={2} title="Thông tin thuê xe" subtitle="Chọn thời gian và địa điểm nhận / trả xe">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <Form.Item name="pickupLocation" label="Nơi nhận xe" rules={[{ required: true, message: 'Hãy chọn nơi nhận xe!' }]}>
                            <Select size="large" placeholder="Chọn thành phố" options={LOCATIONS} />
                        </Form.Item>
                        <Form.Item name="pickupDate" label="Ngày giờ nhận" rules={[{ required: true, message: 'Hãy chọn ngày nhận!' }]}>
                            <DatePicker
                                size="large"
                                className="w-full"
                                showTime={{ format: 'HH:mm' }}
                                format="DD/MM/YYYY HH:mm"
                                disabledDate={(d) => d && d < dayjs().startOf('day')}
                            />
                        </Form.Item>
                        <Form.Item name="dropoffLocation" label="Nơi trả xe" rules={[{ required: true, message: 'Hãy chọn nơi trả xe!' }]}>
                            <Select size="large" placeholder="Chọn thành phố" options={LOCATIONS} />
                        </Form.Item>
                        <Form.Item
                            name="dropoffDate"
                            label="Ngày giờ trả"
                            dependencies={['pickupDate']}
                            rules={[
                                { required: true, message: 'Hãy chọn ngày trả!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const pickup = getFieldValue('pickupDate');
                                        if (!value || !pickup || value.isAfter(pickup)) return Promise.resolve();
                                        return Promise.reject(new Error('Ngày trả phải sau ngày nhận!'));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                size="large"
                                className="w-full"
                                showTime={{ format: 'HH:mm' }}
                                format="DD/MM/YYYY HH:mm"
                                disabledDate={(d) => d && d < dayjs().startOf('day')}
                            />
                        </Form.Item>
                    </div>
                </StepCard>

                <StepCard step={3} title="Phương thức thanh toán" subtitle="Chọn phương thức thanh toán phù hợp">
                    <Form.Item name="paymentMethod">
                        <Radio.Group className="w-full flex flex-col gap-3">
                            <Radio value="card" className="bg-light rounded-lg p-4 m-0">Thẻ tín dụng / ghi nợ</Radio>
                            <Radio value="paypal" className="bg-light rounded-lg p-4 m-0">PayPal</Radio>
                            <Radio value="cash" className="bg-light rounded-lg p-4 m-0">Tiền mặt khi nhận xe</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {/* Chỉ hiện ô nhập thẻ khi chọn thanh toán bằng thẻ */}
                    {paymentMethod === 'card' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 bg-light rounded-lg p-4">
                            <Form.Item
                                name="cardNumber"
                                label="Số thẻ"
                                rules={[
                                    { required: true, message: 'Hãy nhập số thẻ!' },
                                    { pattern: /^\d{16}$/, message: 'Số thẻ gồm 16 chữ số' },
                                ]}
                            >
                                <Input size="large" placeholder="1234123412341234" maxLength={16} />
                            </Form.Item>
                            <Form.Item name="cardHolder" label="Tên chủ thẻ" rules={[{ required: true, message: 'Hãy nhập tên chủ thẻ!' }]}>
                                <Input size="large" placeholder="NGUYEN VAN A" />
                            </Form.Item>
                            <Form.Item name="expiry" label="Ngày hết hạn" rules={[{ required: true, message: 'Hãy chọn ngày hết hạn!' }]}>
                                <DatePicker size="large" picker="month" format="MM/YY" className="w-full" disabledDate={(d) => d && d < dayjs()} />
                            </Form.Item>
                            <Form.Item
                                name="cvc"
                                label="CVC"
                                rules={[
                                    { required: true, message: 'Hãy nhập CVC!' },
                                    { pattern: /^\d{3}$/, message: 'CVC gồm 3 chữ số' },
                                ]}
                            >
                                <Input.Password size="large" placeholder="123" maxLength={3} />
                            </Form.Item>
                        </div>
                    )}
                </StepCard>

                <StepCard step={4} title="Xác nhận" subtitle="Chỉ còn vài thao tác nữa là hoàn tất!">
                    <Form.Item
                        name="agree"
                        valuePropName="checked"
                        rules={[{
                            validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error('Bạn cần đồng ý với điều khoản!'))),
                        }]}
                    >
                        <Checkbox className="bg-light rounded-lg p-4 w-full">
                            Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.
                        </Checkbox>
                    </Form.Item>
                    <Button type="primary" size="large" htmlType="submit" loading={submitting} className="h-14 px-8">
                        Thuê ngay
                    </Button>
                    <div className="mt-6 flex gap-3 items-start">
                        <SafetyCertificateOutlined className="text-2xl text-primary" />
                        <div>
                            <p className="font-semibold">Tất cả dữ liệu của bạn được bảo mật</p>
                            <p className="text-secondary text-sm">Chúng tôi sử dụng công nghệ bảo mật tốt nhất để bảo vệ thông tin của bạn.</p>
                        </div>
                    </div>
                </StepCard>
            </Form>

            {/* Tóm tắt đơn thuê */}
            <aside className="w-full lg:w-96 shrink-0 bg-white rounded-xl p-6 lg:sticky lg:top-28">
                <h3 className="text-xl font-bold">Tóm tắt đơn thuê</h3>
                <p className="text-secondary text-sm mt-1">Giá có thể thay đổi theo thời gian thuê và khuyến mãi.</p>
                <div className="flex gap-4 items-center my-6">
                    <div className="w-32 h-20 rounded-lg p-2 shrink-0" style={{ background: 'linear-gradient(135deg,#54A6FF,#3563E9)' }}>
                        <CarImage color={car.color} className="w-full h-full" />
                    </div>
                    <div>
                        <p className="text-xl font-bold">{car.name}</p>
                        <p className="text-secondary text-sm">{car.type} · {car.capacity} chỗ</p>
                    </div>
                </div>
                <Divider className="my-4" />
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                        <span className="text-secondary">Đơn giá</span>
                        <span className="font-semibold">{formatPrice(car.price)} × {summary.days} ngày</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-secondary">Tạm tính</span>
                        <span className="font-semibold">{formatPrice(summary.subtotal)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Giảm giá ({discount * 100}%)</span>
                            <span className="font-semibold">-{formatPrice(summary.discountValue)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-secondary">Thuế (8%)</span>
                        <span className="font-semibold">{formatPrice(summary.tax)}</span>
                    </div>
                </div>
                <div className="flex gap-2 mt-5">
                    <Input ref={promoRef} size="large" placeholder="Mã khuyến mãi (MORENT10)" />
                    <Button size="large" onClick={handleApplyPromo}>Áp dụng</Button>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <div>
                        <p className="text-lg font-bold">Tổng tiền</p>
                        <p className="text-secondary text-sm">Đã bao gồm thuế</p>
                    </div>
                    <p className="text-3xl font-bold">{formatPrice(summary.total)}</p>
                </div>
            </aside>

            {/* Modal thông báo đặt xe thành công */}
            <Modal open={!!successOrder} footer={null} closable={false} centered>
                {successOrder && (
                    <div className="text-center py-4">
                        <CheckCircleFilled className="text-6xl" style={{ color: '#52c41a' }} />
                        <h3 className="text-2xl font-bold mt-4">Đặt xe thành công!</h3>
                        <p className="text-secondary mt-2">
                            Mã đơn của bạn là <b className="text-dark">{successOrder.id}</b>. Tổng tiền {formatPrice(successOrder.total)}.
                        </p>
                        <div className="flex justify-center gap-3 mt-6">
                            <Button onClick={() => navigate('/')}>Về trang chủ</Button>
                            <Button type="primary" onClick={() => navigate('/orders')}>Xem đơn của tôi</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Booking;
