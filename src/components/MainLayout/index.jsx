import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../Header';
import Footer from '../Footer';

// Layout chung: Header + nội dung trang (Outlet) + Footer
const MainLayout = () => {
    const location = useLocation();

    // Mỗi khi đổi trang, cuộn lên đầu trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Outlet: nơi hiển thị element của route con (Lesson 9: Nested Route) */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
