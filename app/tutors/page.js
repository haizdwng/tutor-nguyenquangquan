'use client';

import { useEffect, useState } from 'react';
import TutorCard from '@/components/TutorCard';
import { toast } from 'react-toastify';

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTutors();
  }, []);
  
  const fetchTutors = async () => {
    try {
      const response = await fetch('/api/tutors');
      const data = await response.json();
      
      if (response.ok) {
        setTutors(data.tutors);
      } else {
        toast.error('Không thể tải danh sách gia sư');
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
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách gia sư...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Danh sách gia sư
          </h1>
          <p className="text-gray-600 text-lg">
            Tìm gia sư phù hợp với nhu cầu học tập của bạn
          </p>
        </div>
        
        {tutors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Chưa có gia sư nào</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-600">
              Tìm thấy <span className="font-semibold">{tutors.length}</span> gia sư
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}