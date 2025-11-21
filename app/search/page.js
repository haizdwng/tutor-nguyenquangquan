'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TutorCard from '@/components/TutorCard';
import FilterSidebar from '@/components/FilterSidebar';
import { toast } from 'react-toastify';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    subject: searchParams.get('subject') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || ''
  });
  
  useEffect(() => {
    searchTutors();
  }, []);
  
  const searchTutors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`/api/tutors?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setTutors(data.tutors);
      } else {
        toast.error('Không thể tìm kiếm gia sư');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        keyword: '',
        subject: '',
        minPrice: '',
        maxPrice: '',
        minRating: ''
      });
      router.push('/search');
      return;
    }
    
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    router.push(`/search?${params.toString()}`);
    searchTutors();
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tìm kiếm gia sư
          </h1>
          <p className="text-gray-600 text-lg">
            Sử dụng bộ lọc bên dưới để tìm gia sư phù hợp
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc môn học..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              className="input-field flex-1"
            />
            <button onClick={handleSearch} className="btn-primary px-8">
              Tìm kiếm
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div>
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange}
            />
            <button 
              onClick={handleSearch}
              className="w-full mt-4 btn-primary"
            >
              Áp dụng bộ lọc
            </button>
          </div>
          
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-600">Đang tìm kiếm...</p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-gray-600">
                  Tìm thấy <span className="font-semibold">{tutors.length}</span> gia sư
                </div>
                
                {tutors.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <p className="text-gray-600 text-lg">
                      Không tìm thấy gia sư phù hợp
                    </p>
                    <button 
                      onClick={() => handleFilterChange('reset')}
                      className="mt-4 btn-secondary"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutors.map((tutor) => (
                      <TutorCard key={tutor._id} tutor={tutor} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}