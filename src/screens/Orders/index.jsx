import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Descriptions, Empty, message, Modal, Popconfirm, Space, Steps, Table, Tabs, Tag } from 'antd';
import CarImage from '../../components/CarImage';
import { Store } from '../../store';
import { formatDate, formatPrice, getOrderStatus } from '../../utils/format';

const PAYMENT_LABEL = { card: 'Thẻ tín dụng', paypal: 'PayPal', cash: 'Tiền mặt' };
const STATUS_STEP = { confirmed: 1, renting: 2, completed: 3 };

// Trang lịch sử đơn hàng + theo dõi tình trạng thuê xe (CTM-ORD02, CTM-SHP01)
const Orders = () => {
    const store = useContext(Store);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [selected, setSelected] = useState(null);

    // Gắn thêm trạng thái vào từng đơn
    const orders = useMemo(
        () => store.orders.value.map((order) => ({ ...order, status: getOrderStatus(order) })),
        [store.orders.value],
    );

    const filteredOrders = activeTab === 'all' ? orders : orders.filter((o) => o.status.key === activeTab);

    const stats = [
        { label: 'Tổng số đơn', value: orders.length },
        { label: 'Đang thuê', value: orders.filter((o) => o.status.key === 'renting').length },
        {
            label: 'Tổng chi tiêu',
            value: formatPrice(orders.filter((o) => !o.cancelled).reduce((sum, o) => sum + o.total, 0)),
        },
    ];

    const handleCancel = (order) => {
        store.orders.cancel(order.id);
        message.success(`Đã huỷ đơn ${order.id}`);
    };

    // Cấu hình cột cho bảng (Lesson 5: Table của AntD)
    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <span className="font-semibold">{id}</span>,
        },
        {
            title: 'Xe',
            dataIndex: 'carName',
            key: 'carName',
            render: (name, record) => (
                <div className="flex items-center gap-3">
                    <div className="w-16 h-10 bg-light rounded-md p-1">
                        <CarImage color={record.carColor} className="w-full h-full" />
                    </div>
                    <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-secondary text-xs">{record.carType}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thời gian thuê',
            key: 'date',
            render: (_, record) => (
                <span>{formatDate(record.pickupDate)} → {formatDate(record.dropoffDate)}</span>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
            render: (total) => <span className="font-semibold">{formatPrice(total)}</span>,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => <Tag color={record.status.color}>{record.status.label}</Tag>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space wrap>
                    <Button size="small" onClick={() => setSelected(record)}>Chi tiết</Button>
                    {record.status.key === 'confirmed' && (
                        <Popconfirm
                            title="Huỷ đơn thuê xe?"
                            description="Bạn chắc chắn muốn huỷ đơn này?"
                            okText="Huỷ đơn"
                            cancelText="Không"
                            onConfirm={() => handleCancel(record)}
                        >
                            <Button size="small" danger>Huỷ</Button>
                        </Popconfirm>
                    )}
                    {record.status.key !== 'cancelled' && record.status.key !== 'confirmed' && (
                        <Button size="small" type="link" onClick={() => navigate(`/cars/${record.carId}`)}>
                            Đánh giá
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const tabItems = [
        { key: 'all', label: `Tất cả (${orders.length})` },
        { key: 'confirmed', label: 'Đã xác nhận' },
        { key: 'renting', label: 'Đang thuê' },
        { key: 'completed', label: 'Hoàn thành' },
        { key: 'cancelled', label: 'Đã huỷ' },
    ];

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Lịch sử đặt xe</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((item) => (
                    <div key={item.label} className="bg-white rounded-xl p-5">
                        <p className="text-secondary text-sm">{item.label}</p>
                        <p className="text-2xl font-bold mt-1">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6">
                <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
                {orders.length === 0 ? (
                    <Empty description="Bạn chưa có đơn thuê xe nào">
                        <Button type="primary" onClick={() => navigate('/cars')}>Thuê xe ngay</Button>
                    </Empty>
                ) : (
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={filteredOrders}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 800 }}
                    />
                )}
            </div>

            {/* Modal chi tiết đơn + theo dõi tình trạng */}
            <Modal
                title={selected ? `Chi tiết đơn ${selected.id}` : ''}
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={<Button onClick={() => setSelected(null)}>Đóng</Button>}
                width={640}
            >
                {selected && (
                    <div className="flex flex-col gap-6">
                        {selected.cancelled ? (
                            <Tag color="red" className="self-start">Đơn đã bị huỷ</Tag>
                        ) : (
                            <Steps
                                size="small"
                                current={STATUS_STEP[selected.status.key]}
                                items={[
                                    { title: 'Đặt xe' },
                                    { title: 'Đã xác nhận' },
                                    { title: 'Đang thuê' },
                                    { title: 'Hoàn thành' },
                                ]}
                            />
                        )}
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Xe">{selected.carName} ({selected.carType})</Descriptions.Item>
                            <Descriptions.Item label="Người thuê">{selected.fullName} - {selected.phone}</Descriptions.Item>
                            <Descriptions.Item label="Nhận xe">{selected.pickupLocation} · {new Date(selected.pickupDate).toLocaleString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label="Trả xe">{selected.dropoffLocation} · {new Date(selected.dropoffDate).toLocaleString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label="Số ngày">{selected.days} ngày</Descriptions.Item>
                            <Descriptions.Item label="Thanh toán">{PAYMENT_LABEL[selected.paymentMethod]}</Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền"><b>{formatPrice(selected.total)}</b></Descriptions.Item>
                            <Descriptions.Item label="Ngày đặt">{new Date(selected.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;
