'use client';
export default function FilterSidebar({ filters, onFilterChange }) {// lấy các children từ trang chủ file page.js
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Bộ lọc</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Môn học
          </label>
          <select
            value={filters.subject || ''}
            onChange={(e) => onFilterChange('subject', e.target.value)}// khi giá trị thay đổi sẽ thực hiện hàm onFilterChange
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
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Giá tối thiểu (đ/giờ)
          </label>
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}// khi giá trị thay đổi sẽ thực hiện hàm onFilterChange
            placeholder="0"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Giá tối đa (đ/giờ)
          </label>
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}// khi giá trị thay đổi sẽ thực hiện hàm onFilterChange
            placeholder="1000000"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Đánh giá tối thiểu
          </label>
          <select
            value={filters.minRating || ''}
            onChange={(e) => onFilterChange('minRating', e.target.value)}// khi giá trị thay đổi sẽ thực hiện hàm onFilterChange
            className="input-field"
          >
            <option value="">Tất cả</option>
            <option value="4">4 sao trở lên</option>
            <option value="4.5">4.5 sao trở lên</option>
            <option value="5">5 sao</option>
          </select>
        </div>
        
        <button
          onClick={() => onFilterChange('reset')}// khi nhấn xóa bộ lọc sẽ thực hiện hàm onFilterChange và xóa bộ lọc
          className="w-full btn-secondary"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}