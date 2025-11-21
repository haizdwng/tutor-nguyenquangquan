'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  StarIcon, 
  ClockIcon, 
  AcademicCapIcon,
  CalendarIcon 
} from '@heroicons/react/24/solid';

export default function TutorDetailPage() {
  const params = useParams();// lấy prams
  const router = useRouter();// điều hướng
  const [tutor, setTutor] = useState(null);// lưu thông tin gia sư
  const [reviews, setReviews] = useState([]);// lưu đánh giá
  const [loading, setLoading] = useState(true);// trạng thái tải
  const [bookingData, setBookingData] = useState({
    hours: 1,
    scheduleDate: '',
    scheduleTime: ''
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  
  useEffect(() => {// khi prams.id thay đổi thì gọi lại
    if (params.id) {
      fetchTutorDetails();
      fetchReviews();
    }
  }, [params.id]);
  
  const fetchTutorDetails = async () => {// lấy chi tiết gia sư
    try {
      const response = await fetch(`/api/tutors/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setTutor(data.tutor);
      } else {
        toast.error(data.error || 'Không tìm thấy gia sư');
        router.push('/tutors');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      router.push('/tutors');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchReviews = async () => {// lấy đánh giá
    try {
      const response = await fetch(`/api/reviews?tutorId=${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải đánh giá');
    }
  };
  
  const handleBooking = async () => {// đặt lịch
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để đặt lịch');
      router.push('/login');
      return;
    }
    
    if (!bookingData.scheduleDate || !bookingData.scheduleTime) {// kiểm tra ngày giờ
      toast.error('Vui lòng chọn ngày và giờ học');
      return;
    }
    
    try {
      const response = await fetch('/api/payment', {// gọi api thanh toán
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tutorId: params.id,
          ...bookingData
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt lịch');
    }
  };
  
  const handleReview = async () => {// đánh giá
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để đánh giá');
      router.push('/login');// điều hướng đến trang đăng nhập
      return;
    }
    
    try {
      const response = await fetch('/api/reviews', {// gọi api đánh giá
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tutorId: params.id,
          ...reviewData
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Đánh giá thành công');
        setReviewData({ rating: 5, comment: '' });
        fetchReviews();
        fetchTutorDetails();
      } else {
        toast.error(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đánh giá');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!tutor) {
    return null;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-start space-x-6">
                <img
                  src={tutor.avatar || '/default-avatar.png'}
                  alt={tutor.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {tutor.name}
                  </h1>
                  <p className="text-xl text-primary-600 font-semibold mb-4">
                    {tutor.subject}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-6 w-6 text-yellow-400" />
                      <span className="text-xl font-semibold">{tutor.rating || 0}</span>
                      <span className="text-gray-500">({tutor.reviewCount || 0} đánh giá)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon className="h-5 w-5" />
                      <span>{tutor.experience} năm kinh nghiệm</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="h-5 w-5 text-gray-600" />
                      <span className="text-3xl font-bold text-primary-600">
                        {tutor.pricePerHour?.toLocaleString('vi-VN')}đ/giờ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Đánh giá từ học viên
              </h2>
              
              {reviews.length === 0 ? (
                <p className="text-gray-600">Chưa có đánh giá nào</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="card mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Viết đánh giá
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Đánh giá
                  </label>
                  <select
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})}
                    className="input-field"
                  >
                    <option value="5">5 sao - Xuất sắc</option>
                    <option value="4">4 sao - Tốt</option>
                    <option value="3">3 sao - Trung bình</option>
                    <option value="2">2 sao - Kém</option>
                    <option value="1">1 sao - Rất kém</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nhận xét
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    rows="4"
                    className="input-field"
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                  ></textarea>
                </div>
                
                <button onClick={handleReview} className="btn-primary">
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="card sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Đặt lịch học
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <CalendarIcon className="h-5 w-5 inline mr-1" />
                    Ngày học
                  </label>
                  <input
                    type="date"
                    value={bookingData.scheduleDate}
                    onChange={(e) => setBookingData({...bookingData, scheduleDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ClockIcon className="h-5 w-5 inline mr-1" />
                    Giờ học
                  </label>
                  <select
                    value={bookingData.scheduleTime}
                    onChange={(e) => setBookingData({...bookingData, scheduleTime: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Chọn giờ học</option>
                    <option value="08:00">08:00</option>
                    <option value="10:00">10:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                    <option value="18:00">18:00</option>
                    <option value="20:00">20:00</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số giờ học
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingData.hours}
                    onChange={(e) => setBookingData({...bookingData, hours: parseInt(e.target.value)})}
                    className="input-field"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Đơn giá:</span>
                    <span className="font-semibold">
                      {tutor.pricePerHour?.toLocaleString('vi-VN')}đ/giờ
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Số giờ:</span>
                    <span className="font-semibold">{bookingData.hours} giờ</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold text-lg">Tổng cộng:</span>
                    <span className="font-bold text-2xl text-primary-600">
                      {(tutor.pricePerHour * bookingData.hours).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
                
                <button onClick={handleBooking} className="w-full btn-primary">
                  Đặt lịch & Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}