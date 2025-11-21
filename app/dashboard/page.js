'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  UserIcon,
  ChartBarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập');
      router.push('/login');
      return;
    }
    
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setData(result);
      } else {
        toast.error(result.error || 'Không thể tải dữ liệu');
        if (response.status === 401) {
          router.push('/login');
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!data) {
    return null;
  }
  
  const statCards = [
    {
      title: 'Tổng đặt lịch',
      value: data.stats.totalBookings,
      icon: <CalendarIcon className="h-8 w-8" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Đã thanh toán',
      value: data.stats.paidBookings,
      icon: <CreditCardIcon className="h-8 w-8" />,
      color: 'bg-green-500'
    },
    {
      title: 'Đang chờ',
      value: data.stats.pendingBookings,
      icon: <ClockIcon className="h-8 w-8" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'Tổng chi tiêu',
      value: `${data.stats.totalSpent.toLocaleString('vi-VN')}đ`,
      icon: <BanknotesIcon className="h-8 w-8" />,
      color: 'bg-purple-500'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Xin chào, {data.user?.name}! Quản lý lịch học và giao dịch của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/schedule" className="card hover:shadow-xl transition-all">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-3 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Thời khóa biểu</h3>
                <p className="text-sm text-gray-600">Xem lịch học sắp tới</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/transactions" className="card hover:shadow-xl transition-all">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Lịch sử giao dịch</h3>
                <p className="text-sm text-gray-600">Xem chi tiết các giao dịch</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/profile" className="card hover:shadow-xl transition-all">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Thông tin cá nhân</h3>
                <p className="text-sm text-gray-600">Cập nhật profile</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2 text-primary-600" />
              Lịch học sắp tới
            </h2>
            
            {data.upcomingSchedule.length === 0 ? (
              <p className="text-gray-600">Chưa có lịch học nào</p>
            ) : (
              <div className="space-y-3">
                {data.upcomingSchedule.map((booking) => (
                  <div key={booking._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{booking.tutorName}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          📅 {new Date(booking.scheduleDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-sm text-gray-600">
                          🕐 {booking.scheduleTime} ({booking.hours} giờ)
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        Đã thanh toán
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Link href="/dashboard/schedule" className="block mt-4 text-primary-600 font-semibold hover:text-primary-700">
              Xem tất cả →
            </Link>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2 text-primary-600" />
              Giao dịch gần đây
            </h2>
            
            {data.recentBookings.length === 0 ? (
              <p className="text-gray-600">Chưa có giao dịch nào</p>
            ) : (
              <div className="space-y-3">
                {data.recentBookings.map((booking) => (
                  <div key={booking._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{booking.tutorName}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.amount.toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        booking.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'paid' ? 'Đã thanh toán' : 
                         booking.status === 'pending' ? 'Đang chờ' : 'Thất bại'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Link href="/dashboard/transactions" className="block mt-4 text-primary-600 font-semibold hover:text-primary-700">
              Xem tất cả →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}