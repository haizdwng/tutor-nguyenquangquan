// em sẽ không giải thích lại các phần đã giải thích trong các file khác
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { CalendarIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SchedulePage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập');
      router.push('/login');
      return;
    }
    
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookings?status=paid', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setBookings(data.bookings);
      } else {
        toast.error(data.error || 'Không thể tải lịch học');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  
  const getFilteredBookings = () => {
    const today = new Date().toISOString().split('T')[0];// định dạng YYYY-MM-DD
    
    switch (filter) {
      case 'upcoming':
        return bookings.filter(b => b.scheduleDate >= today);// lọc các lịch học sắp tới hoặc trong ngày hôm nay
      case 'past':
        return bookings.filter(b => b.scheduleDate < today);// lọc các lịch học đã qua
      default:
        return bookings;
    }
  };
  
  const groupByMonth = (bookingsList) => {// nhóm lịch học theo tháng và năm
    const grouped = {};
    
    bookingsList.forEach(booking => {
      const date = new Date(booking.scheduleDate);// chuyển chuỗi ngày tháng thành đối tượng Date
      const monthYear = date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });// định dạng tháng năm theo chuẩn Việt Nam
      
      if (!grouped[monthYear]) {// nếu chưa có nhóm tháng năm này thì tạo mới
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(booking);// thêm lịch học vào nhóm tương ứng
    });
    
    return grouped;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  const filteredBookings = getFilteredBookings();// lấy danh sách lịch học đã lọc theo bộ lọc
  const groupedBookings = groupByMonth(filteredBookings);// nhóm lịch học đã lọc theo tháng năm
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Quay lại Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <CalendarIcon className="h-8 w-8 mr-3 text-primary-600" />
            Thời khóa biểu
          </h1>
          <p className="text-gray-600">
            Quản lý và xem lịch học của bạn
          </p>
        </div>
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter('all')}// khi bấm nút thì thay đổi bộ lọc
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('upcoming')}// khi bấm nút thì thay đổi bộ lọc
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'upcoming' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sắp tới
          </button>
          <button
            onClick={() => setFilter('past')}// khi bấm nút thì thay đổi bộ lọc
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'past' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Đã qua
          </button>
        </div>
        {filteredBookings.length === 0 ? (// nếu không có lịch học nào sau khi lọc thì hiển thị thông báo
          <div className="card text-center py-12">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">Chưa có lịch học nào</p>
            <Link href="/tutors" className="btn-primary inline-block">
              Tìm gia sư ngay
            </Link>
          </div>
        ) : (// nếu có lịch học thì hiển thị danh sách
          <div className="space-y-8">
            {Object.entries(groupedBookings).map(([monthYear, monthBookings]) => (// lặp qua từng nhóm tháng năm
              <div key={monthYear}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {monthYear}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {monthBookings.map((booking) => {
                    const isPast = booking.scheduleDate < new Date().toISOString().split('T')[0];// kiểm tra xem lịch học đã qua hay chưa
                    
                    return (
                      <div key={booking._id} className={`card ${isPast ? 'opacity-75' : ''}`}>{/* nếu lịch học đã qua thì làm mờ thẻ lại */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {booking.tutorName}
                          </h3>
                          {isPast ? (// nếu lịch học đã qua thì hiển thị nhãn Đã học
                            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                              Đã học
                            </span>
                          ) : (// nếu lịch học sắp tới thì hiển thị nhãn Sắp tới
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                              Sắp tới
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <CalendarIcon className="h-5 w-5 mr-2" />
                            <span>{new Date(booking.scheduleDate).toLocaleDateString('vi-VN', {// định dạng ngày tháng năm theo chuẩn Việt Nam
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <ClockIcon className="h-5 w-5 mr-2" />
                            <span>{booking.scheduleTime} - {booking.hours} giờ</span>
                          </div>
                          
                          <div className="border-t pt-2 mt-2">
                            <p className="text-sm text-gray-600">Số tiền đã thanh toán:</p>
                            <p className="text-lg font-bold text-primary-600">
                              {booking.amount.toLocaleString('vi-VN')}đ{/* định dạng số tiền theo chuẩn Việt Nam */}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}