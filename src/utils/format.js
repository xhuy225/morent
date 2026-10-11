// Định dạng tiền: 99 -> $99.00
export const formatPrice = (value) => `$${Number(value).toFixed(2)}`;

// Định dạng ngày: 2026-10-07 -> 07/10/2026
export const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('vi-VN');
};

// Tính số ngày thuê (tối thiểu 1 ngày)
export const countDays = (from, to) => {
    const diff = new Date(to) - new Date(from);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Danh sách địa điểm nhận / trả xe
export const LOCATIONS = [
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
    { value: 'Hải Phòng', label: 'Hải Phòng' },
    { value: 'Cần Thơ', label: 'Cần Thơ' },
];

export const CAR_TYPES = ['Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'];
export const CAPACITIES = [2, 4, 6, 8];

// Trạng thái thuê xe được tính dựa trên ngày nhận / trả (dùng cho trang theo dõi đơn)
export const getOrderStatus = (order) => {
    if (order.cancelled) return { key: 'cancelled', label: 'Đã huỷ', color: 'red' };
    const now = new Date();
    const pickup = new Date(order.pickupDate);
    const dropoff = new Date(order.dropoffDate);
    if (now < pickup) return { key: 'confirmed', label: 'Đã xác nhận', color: 'blue' };
    if (now <= dropoff) return { key: 'renting', label: 'Đang thuê', color: 'orange' };
    return { key: 'completed', label: 'Hoàn thành', color: 'green' };
};
