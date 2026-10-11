// Hình minh hoạ chiếc xe bằng SVG, màu thân xe nhận qua props (Lesson 3: Props)
// Có thể thay bằng thẻ <img src={car.image} /> nếu bạn có ảnh thật.
const CarImage = ({ color = '#3563E9', className = '' }) => {
    return (
        <svg
            viewBox="0 0 320 120"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Hình xe"
        >
            {/* bóng dưới xe */}
            <ellipse cx="160" cy="104" rx="140" ry="7" fill="#000" opacity="0.08" />
            {/* thân xe */}
            <path
                d="M22 82 C22 70 30 64 44 61 L96 53 C112 36 132 26 162 26 L198 26 C222 26 240 36 258 52 L286 58 C298 61 304 68 304 78 L304 86 C304 90 300 92 296 92 L28 92 C24 92 22 89 22 86 Z"
                fill={color}
            />
            {/* cửa kính */}
            <path d="M108 54 C120 40 136 33 160 33 L172 33 L170 54 Z" fill="#DCE6F5" opacity="0.9" />
            <path d="M178 33 L198 33 C216 33 230 40 244 54 L176 54 Z" fill="#DCE6F5" opacity="0.9" />
            {/* đường gân thân xe */}
            <path d="M40 70 L290 70" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
            {/* đèn */}
            <rect x="286" y="64" width="14" height="6" rx="3" fill="#FFE8A3" />
            <rect x="24" y="66" width="10" height="6" rx="3" fill="#FF6B6B" />
            {/* bánh xe */}
            {[82, 238].map((cx) => (
                <g key={cx}>
                    <circle cx={cx} cy="92" r="19" fill="#1A202C" />
                    <circle cx={cx} cy="92" r="10" fill="#C3D4E9" />
                    <circle cx={cx} cy="92" r="4" fill="#596780" />
                </g>
            ))}
        </svg>
    );
};

export default CarImage;
