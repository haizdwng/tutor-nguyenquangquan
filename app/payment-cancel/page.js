'use client';

import Link from 'next/link';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <XCircleIcon className="h-24 w-24 text-red-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanh toán đã bị hủy
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Giao dịch của bạn đã bị hủy bỏ. Không có khoản tiền nào được trừ từ tài khoản của bạn.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              💡 Nếu bạn gặp vấn đề trong quá trình thanh toán, vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              Về trang chủ
            </Link>
            <Link href="/tutors" className="btn-secondary">
              Xem danh sách gia sư
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}