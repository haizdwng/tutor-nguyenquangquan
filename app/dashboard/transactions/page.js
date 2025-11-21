'use client';
// cacs phần đã giải thích em sẽ không giải thích lại ạ
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  ChartBarIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function TransactionsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập');
      router.push('/login');
      return;
    }
    
    fetchBookings();
  }, [statusFilter]);
  
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = statusFilter === 'all' // nếu lọc tất cả thì không thêm tham số status
        ? '/api/bookings' 
        : `/api/bookings?status=${statusFilter}`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setBookings(data.bookings);
      } else {
        toast.error(data.error || 'Không thể tải giao dịch');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {// hàm trả về nhãn trạng thái dựa trên trạng thái giao dịch
    switch (status) {
      case 'paid':// nếu đã thanh toán
        return (
          <span className="flex items-center space-x-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
            <CheckCircleIcon className="h-4 w-4" />
            <span>Đã thanh toán</span>
          </span>
        );
      case 'pending':// nếu đang chờ
        return (
          <span className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
            <ClockIcon className="h-4 w-4" />
            <span>Đang chờ</span>
          </span>
        );
      case 'failed':// nếu thất bại
        return (
          <span className="flex items-center space-x-1 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
            <XCircleIcon className="h-4 w-4" />
            <span>Thất bại</span>
          </span>
        );
      default:
        return null;
    }
  };
  
  const totalAmount = bookings// tính tổng số tiền đã chi tiêu từ các giao dịch đã thanh toán
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Quay lại Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-primary-600" />
            Lịch sử giao dịch
          </h1>
          <p className="text-gray-600">
            Xem tất cả giao dịch và thanh toán của bạn
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Tổng giao dịch</p>
            <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Đã thanh toán</p>
            <p className="text-3xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'paid').length}{/* số lượng giao dịch đã thanh toán */}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Tổng chi tiêu</p>
            <p className="text-3xl font-bold text-primary-600">
              {totalAmount.toLocaleString('vi-VN')}đ{/* định dạng số tiền theo chuẩn Việt Nam */}
            </p>
          </div>
        </div>
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}// khi bấm nút thì thay đổi bộ lọc
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setStatusFilter('paid')}// khi bấm nút thì thay đổi bộ lọc
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'paid' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Đã thanh toán
          </button>
          <button
            onClick={() => setStatusFilter('pending')}// khi bấm nút thì thay đổi bộ lọc
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'pending' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Đang chờ
          </button>
          <button
            onClick={() => setStatusFilter('failed')}// khi bấm nút thì thay đổi bộ lọc
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'failed' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Thất bại
          </button>
        </div>
        {bookings.length === 0 ? (// nếu không có giao dịch nào thì hiển thị thông báo
          <div className="card text-center py-12">
            <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">Chưa có giao dịch nào</p>
            <Link href="/tutors" className="btn-primary inline-block">
              Đặt lịch học ngay
            </Link>
          </div>
        ) : (// nếu có giao dịch thì hiển thị bảng danh sách
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã đơn</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Gia sư</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày học</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Giờ học</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Số tiền</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (// lặp qua từng giao dịch để hiển thị trong bảng
                    <tr key={booking._id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{booking.orderCode}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">{booking.tutorName}</span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(booking.scheduleDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-4">
                        {booking.scheduleTime} ({booking.hours}h)
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {booking.amount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}