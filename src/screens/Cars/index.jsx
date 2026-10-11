import { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button, Checkbox, Drawer, Empty, Input, Select, Skeleton, Slider, Tag } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import CarCard from '../../components/CarCard';
import { getCars } from '../../services/carService';
import { Store } from '../../store';
import { CAPACITIES, CAR_TYPES } from '../../utils/format';

const MAX_PRICE = 150;

// Trang danh mục / tìm kiếm xe (CTM-VEH01)
const Cars = () => {
    const store = useContext(Store);
    // Search params: giữ bộ lọc trên URL để có thể chia sẻ link (Lesson 9)
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);

    // Lấy giá trị bộ lọc từ URL (giá trị lấy ra luôn là string)
    const keyword = searchParams.get('search') || '';
    const types = searchParams.get('type') ? searchParams.get('type').split(',') : [];
    const capacities = searchParams.get('capacity') ? searchParams.get('capacity').split(',').map(Number) : [];
    const maxPrice = Number(searchParams.get('maxPrice')) || MAX_PRICE;
    const sort = searchParams.get('sort') || 'default';
    const location = searchParams.get('location');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCars();
                setCars(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Cập nhật 1 key trên URL, xoá key nếu giá trị rỗng
    const updateParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
            next.delete(key);
        } else {
            next.set(key, Array.isArray(value) ? value.join(',') : value);
        }
        setSearchParams(next);
    };

    // useMemo: chỉ lọc lại danh sách khi dữ liệu hoặc bộ lọc thay đổi (Lesson 10)
    const filteredCars = useMemo(() => {
        let result = cars.filter((car) => {
            const matchName = car.name.toLowerCase().includes(keyword.toLowerCase());
            const matchType = types.length === 0 || types.includes(car.type);
            const matchCapacity = capacities.length === 0 || capacities.includes(car.capacity);
            const matchPrice = car.price <= maxPrice;
            return matchName && matchType && matchCapacity && matchPrice;
        });
        if (sort === 'asc') result = [...result].sort((a, b) => a.price - b.price);
        if (sort === 'desc') result = [...result].sort((a, b) => b.price - a.price);
        if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cars, searchParams]);

    const countBy = (key, value) => cars.filter((car) => car[key] === value).length;

    const filterPanel = (
        <div className="flex flex-col gap-8">
            <div>
                <p className="text-secondary text-xs font-semibold tracking-widest mb-4">LOẠI XE</p>
                <Checkbox.Group
                    className="flex flex-col gap-3"
                    value={types}
                    onChange={(value) => updateParam('type', value)}
                    options={CAR_TYPES.map((type) => ({
                        value: type,
                        label: <span className="font-semibold">{type} <span className="text-secondary">({countBy('type', type)})</span></span>,
                    }))}
                />
            </div>
            <div>
                <p className="text-secondary text-xs font-semibold tracking-widest mb-4">SỐ CHỖ NGỒI</p>
                <Checkbox.Group
                    className="flex flex-col gap-3"
                    value={capacities}
                    onChange={(value) => updateParam('capacity', value)}
                    options={CAPACITIES.map((cap) => ({
                        value: cap,
                        label: <span className="font-semibold">{cap} người <span className="text-secondary">({countBy('capacity', cap)})</span></span>,
                    }))}
                />
            </div>
            <div>
                <p className="text-secondary text-xs font-semibold tracking-widest mb-2">GIÁ / NGÀY</p>
                <Slider
                    min={50}
                    max={MAX_PRICE}
                    value={maxPrice}
                    onChange={(value) => updateParam('maxPrice', value === MAX_PRICE ? '' : value)}
                />
                <p className="font-semibold">Tối đa ${maxPrice}.00</p>
            </div>
            <Button onClick={() => setSearchParams({})}>Xoá bộ lọc</Button>
        </div>
    );

    return (
        <div className="flex gap-8">
            {/* Bộ lọc bên trái (màn hình lớn) */}
            <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-xl p-6 self-start sticky top-28">
                {filterPanel}
            </aside>

            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <Input.Search
                        size="large"
                        placeholder="Nhập tên xe..."
                        defaultValue={keyword}
                        key={keyword}
                        allowClear
                        onSearch={(value) => updateParam('search', value.trim())}
                    />
                    <Select
                        size="large"
                        className="sm:w-56"
                        value={sort}
                        onChange={(value) => updateParam('sort', value === 'default' ? '' : value)}
                        options={[
                            { value: 'default', label: 'Sắp xếp: Mặc định' },
                            { value: 'asc', label: 'Giá: Thấp → Cao' },
                            { value: 'desc', label: 'Giá: Cao → Thấp' },
                            { value: 'rating', label: 'Đánh giá cao nhất' },
                        ]}
                    />
                    <Button size="large" className="lg:hidden" icon={<FilterOutlined />} onClick={() => setOpenFilter(true)}>
                        Bộ lọc
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-secondary">Tìm thấy <b className="text-dark">{filteredCars.length}</b> xe</span>
                    {location && <Tag color="blue" closable onClose={() => updateParam('location', '')}>Nhận tại: {location}</Tag>}
                    {keyword && <Tag closable onClose={() => updateParam('search', '')}>"{keyword}"</Tag>}
                </div>

                {loading ? (
                    <Skeleton active paragraph={{ rows: 10 }} />
                ) : filteredCars.length === 0 ? (
                    <Empty className="bg-white rounded-xl py-16" description="Không có xe phù hợp với bộ lọc" />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCars.map((car) => (
                            <CarCard key={car.id} car={car} isFavorite={store.favorites.value.includes(car.id)} />
                        ))}
                    </div>
                )}
            </div>

            {/* Bộ lọc dạng Drawer cho màn hình nhỏ */}
            <Drawer title="Bộ lọc" placement="left" open={openFilter} onClose={() => setOpenFilter(false)} width={300}>
                {filterPanel}
            </Drawer>
        </div>
    );
};

export default Cars;
