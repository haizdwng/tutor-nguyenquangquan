// đây là code của trang chủ
// phần này không có 'use client' vì không import các function hay là biến của next như kiểu useState, useRouter
import Link from 'next/link';// thẻ html Link này giống như <a></a> nhưng sẽ tối ưu hơn cho react
import SearchBar from '@/components/SearchBar';// dòng 4 đến 6 là các component em tự build ở trong thư mục /components sẽ giải thích chi tiết
import FeaturedTutors from '@/components/FeaturedTutors';
import Testimonials from '@/components/Testimonials';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  StarIcon 
} from '@heroicons/react/24/outline';// thay vì copy các ảnh svg từ heroicons.com cho dài code thì em import từ thư viện chính thức của họ luôn

export default function Home() {
  const features = [// các banner để hiển thị các thông tin trên web bao gồm icon, tiêu đề và mô tả
    {
      icon: <AcademicCapIcon className="h-12 w-12 text-gray-600" />,
      title: 'Gia sư chất lượng',
      description: 'Đội ngũ gia sư được tuyển chọn kỹ lưỡng với trình độ chuyên môn cao'
    },
    {
      icon: <ClockIcon className="h-12 w-12 text-gray-600" />,
      title: 'Lịch học linh hoạt',
      description: 'Tự do chọn thời gian học phù hợp với lịch trình của bạn'
    },
    {
      icon: <ShieldCheckIcon className="h-12 w-12 text-gray-600" />,
      title: 'Thanh toán an toàn',
      description: 'Hệ thống thanh toán được bảo mật với PayOS'
    },
    {
      icon: <StarIcon className="h-12 w-12 text-gray-600" />,
      title: 'Đánh giá minh bạch',
      description: 'Xem đánh giá thực tế từ học viên trước khi quyết định'
    }
  ];
  return (
    <div>
      <section className="bg-linear-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tìm gia sư phù hợp
            <br />
            <span className="text-gray-600">chỉ trong vài phút</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kết nối với hàng trăm gia sư chất lượng cao trong mọi môn học. 
            Học tập hiệu quả, tiến bộ vượt bậc.
          </p>
          <Link href="/tutors" className="btn-primary inline-block">
            Khám phá ngay{/* khi bấm vào đây sẽ sang trang hiển thị toàn bộ gia sư */}
          </Link>
        </div>
      </section>
      <SearchBar /> {/** build component tìm kiếm ở đây */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao nên chọn Gia Sư Online?
            </h2>
            <p className="text-gray-600 text-lg">
              Những lợi ích tuyệt vời khi sử dụng nền tảng của Gia Sư Online
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (// render các banner có trong biến features
              <div key={index} className="text-center p-6 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex justify-center mb-4">
                  {feature.icon}{/** icon */}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}{/** tiêu đề */}
                </h3>
                <p className="text-gray-600">
                  {feature.description}{/** mô tả */}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FeaturedTutors />{/** build component để hiển thij danh sách gia sư nổi bật */}
      <Testimonials />{/** đánh giá của phụ huynh và học sinh */}
      <section className="py-16 bg-gray-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu học tập?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Đăng ký ngay hôm nay để kết nối với gia sư phù hợp nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-gray-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Đăng ký miễn phí
            </Link>
            <Link href="/tutors" className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors border-2 border-white">
              Xem danh sách gia sư
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};