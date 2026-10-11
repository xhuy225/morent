import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, DatePicker, Select } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { LOCATIONS } from '../../utils/format';

// Khung chọn địa điểm + ngày nhận / trả xe ở trang chủ
const PickupForm = () => {
    const navigate = useNavigate();
    const [pickup, setPickup] = useState({ location: undefined, date: null });
    const [dropoff, setDropoff] = useState({ location: undefined, date: null });

    // Đổi chỗ điểm nhận và điểm trả
    const handleSwap = () => {
        setPickup(dropoff);
        setDropoff(pickup);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (pickup.location) params.set('location', pickup.location);
        navigate(`/cars?${params.toString()}`);
    };

    const renderBox = (title, value, setValue, dotColor) => (
        <div className="bg-white rounded-xl p-5 flex-1 w-full">
            <div className="flex items-center gap-2 mb-3">
                <span className={`w-3 h-3 rounded-full ${dotColor}`} />
                <span className="font-semibold">{title}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <p className="font-bold text-sm mb-1">Địa điểm</p>
                    <Select
                        className="w-full"
                        placeholder="Chọn thành phố"
                        options={LOCATIONS}
                        value={value.location}
                        onChange={(location) => setValue({ ...value, location })}
                    />
                </div>
                <div>
                    <p className="font-bold text-sm mb-1">Ngày giờ</p>
                    <DatePicker
                        className="w-full"
                        showTime={{ format: 'HH:mm' }}
                        format="DD/MM/YYYY HH:mm"
                        placeholder="Chọn ngày giờ"
                        value={value.date}
                        onChange={(date) => setValue({ ...value, date })}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row items-center gap-4">
            {renderBox('Nhận xe', pickup, setPickup, 'bg-primary')}
            <Button
                type="primary"
                size="large"
                icon={<SwapOutlined rotate={90} />}
                onClick={handleSwap}
                className="shrink-0 h-14 w-14"
                aria-label="Đổi điểm nhận / trả"
            />
            {renderBox('Trả xe', dropoff, setDropoff, 'bg-[#54A6FF]')}
            <Button type="primary" size="large" onClick={handleSearch} className="shrink-0 h-14 px-8">
                Tìm xe
            </Button>
        </div>
    );
};

export default PickupForm;
