import { memo, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, message, Tooltip } from 'antd';
import { HeartFilled, HeartOutlined, TeamOutlined, DashboardOutlined, ControlOutlined } from '@ant-design/icons';
import CarImage from '../CarImage';
import { Store } from '../../store';
import { formatPrice } from '../../utils/format';

// memo: thẻ xe chỉ render lại khi props thay đổi (Lesson 10)
const CarCard = memo(({ car, isFavorite }) => {
    const store = useContext(Store);
    const navigate = useNavigate();

    const handleFavorite = () => {
        const ok = store.favorites.toggle(car.id);
        if (!ok) {
            message.info('Vui lòng đăng nhập để lưu xe yêu thích');
            navigate('/login');
            return;
        }
        message.success(isFavorite ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
    };

    return (
        <div className="car-card bg-white rounded-xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <Link to={`/cars/${car.id}`} className="text-dark font-bold text-lg hover:text-primary">
                        {car.name}
                    </Link>
                    <p className="text-secondary text-sm font-semibold mt-1">{car.type}</p>
                </div>
                <Tooltip title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}>
                    <button
                        onClick={handleFavorite}
                        className="border-0 bg-transparent cursor-pointer text-xl p-1"
                        aria-label="Yêu thích"
                    >
                        {isFavorite
                            ? <HeartFilled style={{ color: '#ED3F3F' }} />
                            : <HeartOutlined style={{ color: '#90A3BF' }} />}
                    </button>
                </Tooltip>
            </div>

            <Link to={`/cars/${car.id}`}>
                <CarImage color={car.color} className="w-full h-28" />
            </Link>

            <div className="flex justify-between text-secondary text-sm">
                <span className="flex items-center gap-1"><DashboardOutlined /> {car.gasoline}L</span>
                <span className="flex items-center gap-1"><ControlOutlined /> {car.steering}</span>
                <span className="flex items-center gap-1"><TeamOutlined /> {car.capacity} chỗ</span>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <p className="text-dark font-bold text-lg">
                        {formatPrice(car.price)}
                        <span className="text-secondary text-sm font-semibold">/ngày</span>
                    </p>
                    {car.oldPrice && (
                        <p className="text-secondary text-sm line-through">{formatPrice(car.oldPrice)}</p>
                    )}
                </div>
                <Button type="primary" onClick={() => navigate(`/booking/${car.id}`)}>
                    Thuê ngay
                </Button>
            </div>
        </div>
    );
});

export default CarCard;
