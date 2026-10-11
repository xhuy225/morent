// Call API lấy dữ liệu xe (Lesson 6: Bất đồng bộ, fetch, async/await)
// Dữ liệu đang để ở file public/data/db.json.
// Nếu dùng MindX Mockup Server hoặc mockapi.io, chỉ cần đổi API_URL.
const API_URL = '/data/db.json';

// Giả lập độ trễ mạng để thấy được trạng thái loading
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchDatabase = async () => {
    await delay(400);
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`Lỗi: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const getCars = async () => {
    const data = await fetchDatabase();
    return data.cars;
};

export const getCarById = async (id) => {
    const data = await fetchDatabase();
    const car = data.cars.find((c) => c.id === Number(id));
    if (!car) {
        throw new Error('Không tìm thấy xe!');
    }
    const reviews = data.reviews.filter((r) => r.carId === car.id);
    return { car, reviews };
};
