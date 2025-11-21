'use client';

import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function TutorCard({ tutor }) {// lấy tutor được truyền vào từ các trang sử dụng TutorCảd
  return (
    <div className="card hover:scale-105 transition-transform duration-200">
      <div className="flex items-start space-x-4">
        <Image
          src={tutor.avatar}
          alt={tutor.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
          <p className="text-red-600 font-semibold">{tutor.subject}</p>
          
          <div className="flex items-center space-x-1 mt-2">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="font-semibold">{tutor.rating || 0}</span>
            <span className="text-gray-500 text-sm">
              ({tutor.reviewCount || 0} đánh giá)
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2 text-gray-600">
          <ClockIcon className="h-5 w-5" />
          <span>{tutor.experience} năm kinh nghiệm</span>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-600">
          <AcademicCapIcon className="h-5 w-5" />
          <span className="text-2xl font-bold text-gray-600">
            {tutor.pricePerHour?.toLocaleString('vi-VN')}đ/giờ{/** chuyển giá trị, định dạng số tiền thành định dạng việt nam hay dùng vd: 200.000 1.000 */}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <Link
          href={`/tutors/${tutor._id}`}// thêm id vào prams để thực hiện lấy id trong các trang search hoặc xem chi tiết gia sư
          className="block text-center btn-primary"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}