import { Link } from 'react-router';

// Tiêu đề của mỗi khu vực, có thể kèm link "Xem tất cả"
const SectionTitle = ({ title, linkTo }) => {
    return (
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-secondary font-semibold text-base">{title}</h3>
            {linkTo && (
                <Link to={linkTo} className="text-primary font-semibold text-sm">
                    Xem tất cả
                </Link>
            )}
        </div>
    );
};

export default SectionTitle;
