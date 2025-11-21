import Link from 'next/link';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-400 mb-4">
              Gia Sư Online
            </h3>
            <p className="text-gray-400">
              Nền tảng kết nối gia sư chất lượng cao với học viên trên toàn quốc
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/tutors" className="text-gray-400 hover:text-white transition-colors">
                  Danh sách gia sư
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
                  Tìm kiếm
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">Gia sư Toán</li>
              <li className="text-gray-400">Gia sư Lý</li>
              <li className="text-gray-400">Gia sư Hóa</li>
              <li className="text-gray-400">Gia sư Tiếng Anh</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <PhoneIcon className="h-5 w-5" />
                <span>032 639 6827</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <EnvelopeIcon className="h-5 w-5" />
                <span>haizdwng@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPinIcon className="h-5 w-5" />
                <span>Nghệ An, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Gia Sư Online. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}