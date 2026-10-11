import { Link } from 'react-router';

const columns = [
    {
        title: 'Về chúng tôi',
        links: ['Cách hoạt động', 'Nổi bật', 'Đối tác', 'Quan hệ kinh doanh'],
    },
    {
        title: 'Cộng đồng',
        links: ['Sự kiện', 'Blog', 'Podcast', 'Mời bạn bè'],
    },
    {
        title: 'Mạng xã hội',
        links: ['Discord', 'Instagram', 'Twitter', 'Facebook'],
    },
];

const Footer = () => {
    return (
        <footer className="bg-white mt-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-10 justify-between">
                <div className="max-w-xs">
                    <Link to="/" className="text-primary text-3xl font-extrabold">MORENT</Link>
                    <p className="text-secondary mt-4 leading-relaxed">
                        Sứ mệnh của chúng tôi là mang đến trải nghiệm thuê xe tiện lợi, an toàn và minh bạch cho mọi người.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-dark font-bold mb-4">{col.title}</h4>
                            <ul className="list-none p-0 m-0 flex flex-col gap-3">
                                {col.links.map((link) => (
                                    <li key={link} className="text-secondary text-sm">{link}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-dark text-sm font-semibold border-t border-solid border-[#13131F1A] border-x-0 border-b-0">
                <span>©2026 MORENT. Đã đăng ký bản quyền.</span>
                <span className="flex gap-8">
                    <span>Chính sách bảo mật</span>
                    <span>Điều khoản</span>
                </span>
            </div>
        </footer>
    );
};

export default Footer;
