'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { UserIcon, Bars3Icon, XMarkIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');// lấy token từ localStorage
    const userData = localStorage.getItem('user');// lấy dữ liệu người dùng từ localStg
    
    if (token && userData) {// nếu có 2 cái này thì
      setIsLoggedIn(true);// vào trạng thái đã đăng nhập
      setUser(JSON.parse(userData));// lấy thông tin người dùng để lưu vào biến user
    }
  }, []);
  
  const handleLogout = () => {// đăng xuất
    localStorage.removeItem('token');// xóa token 
    localStorage.removeItem('user');// xóa dataUser
    setIsLoggedIn(false);// xóa trạng thái đăng nhập
    setUser(null);// xóa dữ liệu người dùng
    window.location.href = '/';// chuyển đến trang chính
  };
  
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image /** logo của ưebsite */
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <span className="text-2xl font-bold text-gray-600">
                Gia Sư Online
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-600 transition-colors">
              Trang chủ
            </Link>
            <Link href="/tutors" className="text-gray-700 hover:text-gray-600 transition-colors">
              Danh sách gia sư
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-gray-600 transition-colors">
              Tìm kiếm
            </Link>
            
            {isLoggedIn ? (// nếu đã đăng nhập thì render các element này
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-600 transition-colors"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{user?.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (// nếu chưa thì render cái này
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-700 font-semibold"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
