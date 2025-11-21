// do dùng useEffect, .. nên cần dòng 'use client'
// useEffect là để luôn chạy đi chạy lại một hàm, mootj hành động nào đó
// useState là để theo theo biến đã thay đổi chưa để server biết và rebuild lại, nếu dùng const hoặc let thì khi giá trị, biến đó thay đổi sẽ không rebuild lại
'use client';
import { useEffect, useState } from 'react';
import TutorCard from './TutorCard';// build component thẻ hiện thông tin gia sư tại đây
import { toast } from 'react-toastify';// function để giúp hiện thông báo

export default function FeaturedTutors() {
  const [tutors, setTutors] = useState([]);// theo dõi giá trị các gia sư để phát hiện thay đổi, giá trị ban đầu là một mảng chưa có gì
  const [loading, setLoading] = useState(true);// theo dõi giá giá loading để hiện thị trạng thái đang tải khi bấm nút, hoặc mới tải laị, vaof trang ưeb
  
  useEffect(() => {
    fetchFeaturedTutors();//luôn thực hiện hàm lấy thông tin tất cả gia sư từ mongodb
  }, []);
  
  const fetchFeaturedTutors = async () => {
    try {// thử
      const response = await fetch('/api/tutors');// gửi request để lấy tất cả gia sư từ backend
      const data = await response.json();// chuyển dữ liệu thành dạng json để de thao tác
      
      if (response.ok) {// nếu gửi req và trả về dữ liệu thì
        const featured = data.tutors// lấy dữ liệu tất cả gia sư từ data.tutors
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))//lấy, lọc các gia sư có đánh giá cao nhất để hiển thị 
          .slice(0, 6);// chỉ lấy 6 gia sư có đánh giá cao nhất
        setTutors(featured);// thay đổi biến tutors bằng cách dùng setTutors
      } else {// nếu lỗi thì thông báo
        toast.error('Không thể tải danh sách gia sư');// thông báo error
      }
    } catch (error) {//nếu có lỗi
      toast.error('Có lỗi xảy ra');// thông báo lỗi
    } finally {// hoàn thành
      setLoading(false);// bỏ trạng thái loading
    }
  };
  
  if (loading) {// element loading hiển thị trạng thái đang tải, nếu true thì hiện, nếu false thì ẩn
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Gia sư nổi bật
          </h2>
          <p className="text-gray-600 text-lg">
            Những gia sư được đánh giá cao nhất
          </p>
        </div>
        
        {tutors.length === 0 ? (// nếu tutors.length === 0 đúng thì hiện chưa có gia sư
          <p className="text-center text-gray-600">Chưa có gia sư nào</p>
        ) : (// nếu không đúng thì build element toàn bộ gia sư
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}