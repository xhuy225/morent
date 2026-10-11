import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Avatar, Breadcrumb, Button, Form, Input, message, Rate, Result, Skeleton, Tag } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import CarImage from '../../components/CarImage';
import { getCarById } from '../../services/carService';
import { Store } from '../../store';
import { formatDate, formatPrice } from '../../utils/format';

// Một vài màu nền cho ảnh nhỏ (thumbnail)
const THUMB_BG = ['linear-gradient(135deg,#54A6FF,#3563E9)', '#F6F7F9', '#EAF0FF'];

// Trang chi tiết xe + đánh giá (CTM-RVW01)
const CarDetail = () => {
    // useParams: lấy carId trên URL /cars/:carId (Lesson 9)
    const { carId } = useParams();
    const navigate = useNavigate();
    const store = useContext(Store);
    const [form] = Form.useForm();

    const [car, setCar] = useState(null);
    const [baseReviews, setBaseReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeThumb, setActiveThumb] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Gọi lại API mỗi khi carId thay đổi
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getCarById(carId);
                setCar(data.car);
                setBaseReviews(data.reviews);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [carId]);

    if (loading) return <Skeleton active paragraph={{ rows: 12 }} />;
    if (error) {
        return (
            <Result
                status="404"
                title="Không tìm thấy xe"
                subTitle={error}
                extra={<Button type="primary" onClick={() => navigate('/cars')}>Xem danh sách xe</Button>}
            />
        );
    }

    const user = store.auth.value;
    const isFavorite = store.favorites.value.includes(car.id);
    // Đánh giá người dùng tự viết (lưu trong Context) + đánh giá có sẵn
    const allReviews = [...store.reviews.value.filter((r) => r.carId === car.id), ...baseReviews];
    const visibleReviews = showAllReviews ? allReviews : allReviews.slice(0, 2);
    // Chỉ khách hàng đã thuê xe này mới được đánh giá
    const hasRented = store.orders.value.some((o) => o.carId === car.id && !o.cancelled);

    const handleFavorite = () => {
        if (!store.favorites.toggle(car.id)) {
            message.info('Vui lòng đăng nhập để lưu xe yêu thích');
            navigate('/login', { state: { from: `/cars/${car.id}` } });
        }
    };

    const handleReview = (values) => {
        store.reviews.add({ carId: car.id, rating: values.rating, content: values.content });
        form.resetFields();
        message.success('Cảm ơn bạn đã đánh giá!');
    };

    const specs = [
        { label: 'Loại xe', value: car.type },
        { label: 'Số chỗ', value: `${car.capacity} người` },
        { label: 'Hộp số', value: car.steering },
        { label: 'Bình xăng', value: `${car.gasoline}L` },
    ];

    return (
        <div className="flex flex-col gap-8">
            <Breadcrumb
                items={[
                    { title: <Link to="/">Trang chủ</Link> },
                    { title: <Link to="/cars">Thuê xe</Link> },
                    { title: car.name },
                ]}
            />

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ảnh xe */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-xl p-8 min-h-[300px] flex flex-col justify-between" style={{ background: THUMB_BG[activeThumb] }}>
                        <div className={activeThumb === 0 ? 'text-white' : 'text-dark'}>
                            <h2 className="text-2xl md:text-3xl font-semibold">Xe thể thao với thiết kế đẹp nhất</h2>
                            <p className="mt-3 opacity-90">An toàn và thoải mái khi lái xe, vui vẻ và sang trọng.</p>
                        </div>
                        <CarImage color={car.color} className="w-4/5 self-center mt-6" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {THUMB_BG.map((bg, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveThumb(index)}
                                className={`rounded-lg h-24 p-3 cursor-pointer border-2 border-solid ${activeThumb === index ? 'border-primary' : 'border-transparent'}`}
                                style={{ background: bg }}
                                aria-label={`Ảnh ${index + 1}`}
                            >
                                <CarImage color={car.color} className="w-full h-full" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Thông tin xe */}
                <div className="bg-white rounded-xl p-6 md:p-8 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">{car.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Rate disabled allowHalf value={car.rating} className="text-base" />
                                <span className="text-secondary text-sm">{car.reviewCount}+ đánh giá</span>
                            </div>
                        </div>
                        <Button
                            shape="circle"
                            size="large"
                            onClick={handleFavorite}
                            icon={isFavorite ? <HeartFilled style={{ color: '#ED3F3F' }} /> : <HeartOutlined />}
                        />
                    </div>

                    <p className="text-[#596780] leading-loose text-base">{car.description}</p>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {specs.map((spec) => (
                            <div key={spec.label} className="flex justify-between">
                                <span className="text-secondary">{spec.label}</span>
                                <span className="font-semibold text-[#596780]">{spec.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-end mt-auto">
                        <div>
                            <p className="text-2xl font-bold">
                                {formatPrice(car.price)}<span className="text-secondary text-base font-semibold">/ngày</span>
                            </p>
                            {car.oldPrice && <p className="text-secondary line-through">{formatPrice(car.oldPrice)}</p>}
                        </div>
                        <Button type="primary" size="large" className="h-14 px-8" onClick={() => navigate(`/booking/${car.id}`)}>
                            Thuê ngay
                        </Button>
                    </div>
                </div>
            </section>

            {/* Đánh giá */}
            <section className="bg-white rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-xl font-semibold">Đánh giá</h3>
                    <Tag color="blue" className="font-bold">{allReviews.length}</Tag>
                </div>

                {allReviews.length === 0 && <p className="text-secondary">Chưa có đánh giá nào cho xe này.</p>}

                <div className="flex flex-col gap-6">
                    {visibleReviews.map((review) => (
                        <div key={review.id} className="flex gap-4">
                            <Avatar size={52} style={{ backgroundColor: '#3563E9', flexShrink: 0 }}>
                                {review.name.charAt(0)}
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between flex-wrap gap-2">
                                    <div>
                                        <p className="font-bold text-lg">{review.name}</p>
                                        <p className="text-secondary text-sm">{review.role}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-secondary text-sm">{formatDate(review.date)}</p>
                                        <Rate disabled value={review.rating} className="text-sm" />
                                    </div>
                                </div>
                                <p className="text-[#596780] mt-3 leading-relaxed">{review.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {allReviews.length > 2 && (
                    <div className="text-center mt-6">
                        <Button type="text" onClick={() => setShowAllReviews(!showAllReviews)}>
                            {showAllReviews ? 'Thu gọn' : 'Xem tất cả đánh giá'}
                        </Button>
                    </div>
                )}

                {/* Form viết đánh giá */}
                <div className="mt-8 pt-6 border-t border-solid border-[#F3F5F7] border-x-0 border-b-0">
                    <h4 className="font-semibold text-lg mb-4">Viết đánh giá của bạn</h4>
                    {!user ? (
                        <p className="text-secondary">
                            Vui lòng <Link to="/login" state={{ from: `/cars/${car.id}` }}>đăng nhập</Link> để đánh giá.
                        </p>
                    ) : !hasRented ? (
                        <p className="text-secondary">Bạn cần thuê xe này trước khi có thể đánh giá.</p>
                    ) : (
                        <Form form={form} layout="vertical" onFinish={handleReview} initialValues={{ rating: 5 }}>
                            <Form.Item name="rating" label="Số sao" rules={[{ required: true, message: 'Hãy chọn số sao!' }]}>
                                <Rate />
                            </Form.Item>
                            <Form.Item
                                name="content"
                                label="Nhận xét"
                                rules={[
                                    { required: true, message: 'Hãy nhập nhận xét!' },
                                    { min: 10, message: 'Nhận xét tối thiểu 10 ký tự' },
                                ]}
                            >
                                <Input.TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn về chiếc xe..." />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">Gửi đánh giá</Button>
                        </Form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CarDetail;
