import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ConfigProvider } from 'antd';
import App from './App.jsx';
import StoreBoundary from './store/index.jsx';
import './index.css';

// Màu chủ đạo của Morent theo Figma
const theme = {
  token: {
    colorPrimary: '#3563E9',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: 10,
  },
};

createRoot(document.getElementById('root')).render(
  // BrowserRouter: bắt buộc để dùng React Router (Lesson 9)
  <BrowserRouter>
    {/* StoreBoundary: Context dùng chung toàn ứng dụng (Lesson 8) */}
    <StoreBoundary>
      {/* ConfigProvider: cấu hình theme cho Ant Design (Lesson 5) */}
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </StoreBoundary>
  </BrowserRouter>,
);
