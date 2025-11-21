'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const [subject, setSubject] = useState('');
  const router = useRouter();
  
  const handleSearch = (e) => {
    e.preventDefault();// ngăn các hành động reload lại ưebsite
    
    const params = new URLSearchParams();// tạo một prams
    if (keyword) params.append('keyword', keyword);// thêm keyword với giá trị từ khóa người dùng nhập vào prams vừa tạo
    if (subject) params.append('subject', subject);// thêm subject với giá trị môn học người dùng nhập vào prams vừa tạo
    
    router.push(`/search?${params.toString()}`);// đến đường dẫn này
  };
  
  return (
    <div className="bg-linear-to-r from-gray-500 to-gray-700 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          Tìm gia sư phù hợp với bạn
        </h2>
        
        <form onSubmit={handleSearch} /** nếu nhấn nút type là submit thì thực hiện hàm handleSearch */ className="bg-white rounded-xl shadow-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc môn học..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}// đặt biến keyword thành từ khóa người dùng nhập vào
                className="input-field"
              />
            </div>
            
            <div>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}// ddawth biến subject thành môn học người dùng chọn
                className="input-field"
              >
                <option value="">Tất cả môn học</option>
                <option value="Toán">Toán</option>
                <option value="Lý">Vật Lý</option>
                <option value="Hóa">Hóa Học</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Văn">Ngữ Văn</option>
                <option value="Sinh">Sinh Học</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"// nhấn nút này sẽ thực hiện
            className="w-full mt-4 btn-primary flex items-center justify-center space-x-2 cursor-pointer"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span>Tìm kiếm</span>
          </button>
        </form>
      </div>
    </div>
  );
}