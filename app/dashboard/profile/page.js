'use client';
// phải dùng 'use client' để sử dụng các hook của react như useState, useEffect
import { useEffect, useState } from 'react';// sử dụng hook useEffect để thực thi các tác vụ phụ, useState để quản lý trạng thái
import { useRouter } from 'next/navigation';// sử dụng hook useRouter để điều hướng trang
import Link from 'next/link';// giống như thẻ a nhưng tối ưu cho nextjs
import { toast } from 'react-toastify';// hàm hiển thị thông báo
import { 
  UserIcon, 
  ArrowLeftIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';// thay vì dùng code svg từ heroicons.com cho dài code thì em dùng thư viện chính thức heroicons để import các icon cần dùng

export default function ProfilePage() {
  const router = useRouter();// sử dụng hook useRouter để điều hướng
  const [user, setUser] = useState(null);// lưu thông tin người dùng
  const [loading, setLoading] = useState(true);// trạng thái tải dữ liệu
  
  useEffect(() => {
    const token = localStorage.getItem('token');// lấy token từ localStorage
    if (!token) {// nếu không có token thì yêu cầu đăng nhập
      toast.error('Vui lòng đăng nhập');
      router.push('/login');// điều hướng đến trang đăng nhập
      return;
    }
    
    fetchProfile();// gọi hàm fetchProfile để lấy thông tin người dùng
  }, []);
  
  const fetchProfile = async () => {// hàm lấy thông tin người dùng
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard', {// gọi api gửi req đến route.js để lấy thông tin người dùng
        headers: {
          'Authorization': `Bearer ${token}`// gửi kèm token trong header
        }
      });
      
      const data = await response.json();// chuyển phản hồi thành JSON
      
      if (response.ok) {// nếu phản hồi thành công thì lưu thông tin người dùng vào state
        setUser(data.user);
      } else {// nếu phản hồi lỗi thì hiển thị thông báo lỗi
        toast.error(data.error || 'Không thể tải thông tin');
        if (response.status === 401) {
          router.push('/login');// điều hướng đến trang đăng nhập nếu lỗi 401
        }
      }
    } catch (error) {// xử lý lỗi khi gọi API
      toast.error('Có lỗi xảy ra');
    } finally {// cuối cùng thì đặt trạng thái loading thành false
      setLoading(false);
    }
  };
  
  if (loading) {// hiển thị biểu tượng tải dữ liệu khi đang trong trạng thái loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!user) {// nếu không có thông tin người dùng thì không hiển thị gì cả
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Quay lại Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <UserIcon className="h-8 w-8 mr-3 text-primary-600" />
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>
        <div className="card">
          <div className="flex items-center space-x-6 mb-8">
            <div className="bg-primary-100 rounded-full p-6">
              <UserIcon className="h-16 w-16 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên
                </label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span>{user.name}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vai trò
                </label>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                  {user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày đăng ký
                </label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN', {// định dạng ngày tháng năm theo chuẩn Việt Nam
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link href="/dashboard/schedule" className="card hover:shadow-xl transition-all text-center">
            <CalendarIcon className="h-12 w-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Xem lịch học</h3>
            <p className="text-sm text-gray-600">Quản lý thời khóa biểu của bạn</p>
          </Link>
          
          <Link href="/tutors" className="card hover:shadow-xl transition-all text-center">
            <UserIcon className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Tìm gia sư</h3>
            <p className="text-sm text-gray-600">Đặt lịch học với gia sư mới</p>
          </Link>
        </div>
        <div className="card mt-8 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">Bảo mật tài khoản</h3>
          <p className="text-gray-700 text-sm">
            Để đảm bảo an toàn tài khoản, hãy luôn giữ mật khẩu của bạn được bảo mật 
            và không chia sẻ thông tin đăng nhập với người khác.
          </p>
        </div>
      </div>
    </div>
  );
}