import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Empty, Skeleton } from 'antd';
import CarCard from '../../components/CarCard';
import { getCars } from '../../services/carService';
import { Store } from '../../store';

// Trang danh sách xe yêu thích
const Favorites = () => {
    const store = useContext(Store);
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCars()
            .then((data) => setCars(data))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    const favoriteCars = cars.filter((car) => store.favorites.value.includes(car.id));

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Xe yêu thích ({store.favorites.value.length})</h1>
            {loading ? (
                <Skeleton active />
            ) : favoriteCars.length === 0 ? (
                <Empty className="bg-white rounded-xl py-16" description="Bạn chưa lưu xe nào">
                    <Button type="primary" onClick={() => navigate('/cars')}>Khám phá xe</Button>
                </Empty>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favoriteCars.map((car) => (
                        <CarCard key={car.id} car={car} isFavorite />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
