'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderCode = searchParams.get('orderCode');
  
  useEffect(() => {
    if (orderCode) {
      confirmPayment();
      fetchBookingDetails();
    } else {
      router.push('/');
    }
  }, [orderCode]);
  
  const confirmPayment = async () => {
    try {
      await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderCode: orderCode,
          status: 'success'
        })
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xác nhận thanh toán');
    }
  };
  
  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/payment?orderCode=${orderCode}`);
      const data = await response.json();
      
      if (response.ok) {
        setBooking(data.booking);
      } else {
        toast.error('Không thể tải thông tin đơn hàng');
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
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanh toán thành công!
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Đơn hàng của bạn đã được xác nhận. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
          </p>
          
          {booking && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Thông tin đặt lịch
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gia sư:</span>
                  <span className="font-semibold">{booking.tutorName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày học:</span>
                  <span className="font-semibold">
                    {new Date(booking.scheduleDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Giờ học:</span>
                  <span className="font-semibold">{booking.scheduleTime}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Số giờ:</span>
                  <span className="font-semibold">{booking.hours} giờ</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-gray-600 font-semibold">Tổng thanh toán:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {booking.amount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-mono text-sm">{booking.orderCode}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800">
              📧 Thông tin chi tiết đã được gửi đến email của bạn. 
              Gia sư sẽ liên hệ với bạn trước buổi học.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              Về trang chủ
            </Link>
            <Link href="/tutors" className="btn-secondary">
              Tìm gia sư khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}