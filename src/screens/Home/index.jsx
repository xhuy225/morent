import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Result, Skeleton } from 'antd';
import CarCard from '../../components/CarCard';
import CarImage from '../../components/CarImage';
import PickupForm from '../../components/PickupForm';
import SectionTitle from '../../components/SectionTitle';
import { getCars } from '../../services/carService';
import { Store } from '../../store';

// Banner quảng cáo ở đầu trang chủ
const Banner = ({ title, description, color, bg, carColor, onClick }) => (
    <div className="rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[300px] overflow-hidden" style={{ background: bg }}>
        <div className="max-w-xs">
            <h2 className="text-white text-2xl md:text-3xl font-semibold leading-snug">{title}</h2>
            <p className="text-white/90 mt-4 leading-relaxed">{description}</p>
            <Button className="mt-5" type="primary" style={{ background: color }} onClick={onClick}>
                Thuê xe ngay
            </Button>
        </div>
        <CarImage color={carColor} className="w-4/5 self-center mt-4" />
    </div>
);

const Home = () => {
    const store = useContext(Store);
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAll, setShowAll] = useState(false);

    // useCallback: ghi nhớ hàm gọi API, dùng được cả trong useEffect và nút "Thử lại"
    const fetchCars = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getCars();
            setCars(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect: gọi API 1 lần sau khi component render (Lesson 7)
    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    const popularCars = cars.filter((car) => car.popular);
    const recommendCars = cars.filter((car) => !car.popular);
    const visibleRecommend = showAll ? recommendCars : recommendCars.slice(0, 4);

    const renderGrid = (list) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((car) => (
                <CarCard key={car.id} car={car} isFavorite={store.favorites.value.includes(car.id)} />
            ))}
        </div>
    );

    return (
        <div className="flex flex-col gap-10">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Banner
                    title="Nền tảng thuê xe tốt nhất"
                    description="Dễ dàng thuê xe an toàn và đáng tin cậy. Tất nhiên là với giá thấp."
                    bg="linear-gradient(135deg,#54A6FF,#3D81DB)"
                    color="#3563E9"
                    carColor="#E8E8E8"
                    onClick={() => navigate('/cars')}
                />
                <Banner
                    title="Dễ dàng thuê xe với giá ưu đãi"
                    description="Cung cấp dịch vụ thuê xe giá rẻ, an toàn và thoải mái."
                    bg="linear-gradient(135deg,#3563E9,#1E3FA6)"
                    color="#54A6FF"
                    carColor="#D7263D"
                    onClick={() => navigate('/cars?type=Sport')}
                />
            </section>

            <section>
                <PickupForm />
            </section>

            {loading && <Skeleton active paragraph={{ rows: 8 }} />}

            {error && (
                <Result
                    status="error"
                    title="Không tải được danh sách xe"
                    subTitle={error}
                    extra={<Button type="primary" onClick={fetchCars}>Thử lại</Button>}
                />
            )}

            {!loading && !error && (
                <>
                    <section>
                        <SectionTitle title="Xe phổ biến" linkTo="/cars" />
                        {renderGrid(popularCars)}
                    </section>

                    <section>
                        <SectionTitle title="Xe đề xuất" />
                        {renderGrid(visibleRecommend)}
                        <div className="flex justify-center items-center mt-10 relative">
                            {recommendCars.length > 4 && (
                                <Button type="primary" size="large" onClick={() => setShowAll(!showAll)}>
                                    {showAll ? 'Thu gọn' : 'Xem thêm xe'}
                                </Button>
                            )}
                            <span className="absolute right-0 text-secondary text-sm">{cars.length} xe</span>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Home;
