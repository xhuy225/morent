// Hàm tiện ích đọc / ghi dữ liệu vào localStorage
// Bọc trong try...catch để ứng dụng không bị crash nếu trình duyệt chặn localStorage

export const loadData = (key, defaultValue) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    } catch (error) {
        console.log('Không đọc được localStorage:', error);
        return defaultValue;
    }
};

export const saveData = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log('Không ghi được localStorage:', error);
    }
};
