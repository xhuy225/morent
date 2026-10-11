# MORENT - Website thuê xe ô tô

Sản phẩm cuối khoá CI (MindX), đề tài **Car rent Morent**, xây dựng bằng ReactJS (Vite).

## Cài đặt và chạy

Yêu cầu: đã cài NodeJS.

```bash
npm install
npm run dev
```

Mở đường dẫn `http://localhost:5173` hiện trên terminal.

Tài khoản demo: **demo@morent.com / 123456** (hoặc tự đăng ký tài khoản mới).

Mã khuyến mãi để thử: `MORENT10` (giảm 10%), `MINDX20` (giảm 20%).

## Công nghệ

- ReactJS + Vite
- Ant Design (Table, Form, Modal, Drawer, Dropdown, Tooltip, Tabs...)
- Tailwind CSS v3 (tắt `preflight` để không đè style của AntD)
- React Router v7
- Dữ liệu xe: `public/data/db.json`, gọi bằng `fetch` + `async/await`
- Dữ liệu người dùng, đơn hàng, yêu thích, đánh giá: lưu bằng Context + localStorage

## Giao diện (khách hàng)

| # | Giao diện | Đường dẫn | Mã chức năng |
|---|-----------|-----------|--------------|
| 1 | Trang chủ (banner, chọn nơi nhận/trả, xe phổ biến, xe đề xuất) | `/` | |
| 2 | Tìm kiếm xe (lọc loại xe, số chỗ, giá, sắp xếp) | `/cars` | CTM-VEH01 |
| 3 | Chi tiết xe + đánh giá xe | `/cars/:carId` | CTM-RVW01 |
| 4 | Đặt xe và thanh toán | `/booking/:carId` | CTM-ORD01, CTM-PRM01 |
| 5 | Lịch sử đơn + theo dõi tình trạng thuê | `/orders` | CTM-ORD02, CTM-SHP01 |
| 6 | Đăng nhập | `/login` | CTM-LOG01 |
| 7 | Đăng ký | `/register` | CTM-REG01 |
| 8 | Tài khoản cá nhân (sửa thông tin, đổi mật khẩu) | `/account` | CTM-ACC01 |
| 9 | Xe yêu thích | `/favorites` | |

Các trang 4, 5, 8, 9 yêu cầu đăng nhập (Protected Route).

## Kiến thức đã áp dụng (Lesson 3 → 10)

| Bài | Kiến thức | Áp dụng ở đâu |
|-----|-----------|---------------|
| 3 | Component, JSX, Props | Toàn bộ `components/`, ví dụ `CarCard` nhận `car`, `isFavorite` |
| 4 | State, State x Props | `useState` ở các trang, truyền state xuống component con |
| 5 | Ant Design, Tailwind | Table (Orders), Form (Booking, Login...), Modal, Drawer, Dropdown, Tooltip |
| 6 | Bất đồng bộ, fetch, async/await, try...catch | `services/carService.js`, giả lập gửi đơn ở Booking |
| 7 | useEffect | Gọi API khi vào trang, lưu localStorage trong `store/index.jsx` |
| 8 | Context | `store/index.jsx` (đăng nhập, yêu thích, đơn hàng, đánh giá) |
| 9 | Routing | `App.jsx`: Nested Route, Outlet, `useParams`, `useSearchParams`, `useNavigate`, Link/NavLink, Protected Route |
| 10 | useRef, memo, useMemo, useCallback | `useRef` ô tìm kiếm (Header) và mã khuyến mãi (Booking); `memo` cho CarCard; `useMemo` lọc xe, tính tiền; `useCallback` hàm gọi API ở Home |

## Cấu trúc thư mục

```
src/
├── components/      # Các component dùng chung (Header, Footer, CarCard...)
├── screens/         # Các trang
├── services/        # Gọi API
├── store/           # Context + localStorage
├── utils/           # Hàm tiện ích, hằng số
├── App.jsx          # Khai báo route
└── main.jsx         # Điểm khởi chạy
```

## Đổi sang API thật

Mở `src/services/carService.js` và thay `API_URL` bằng đường dẫn MindX Mockup Server hoặc mockapi.io có cùng cấu trúc dữ liệu.
