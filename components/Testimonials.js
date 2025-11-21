import { StarIcon } from '@heroicons/react/24/solid';

export default function Testimonials() {
  const testimonials = [// giả lập các đánh giá của phụ huynh để dưa ra trang chủ, bao gồm : id, tên, vai trò, nội dung đánh giá, sao đánh giá và avatar là các icon
    {
      id: 1,
      name: 'Nguyễn Thị Lan',
      role: 'Phụ huynh học sinh lớp 10',
      content: 'Con tôi đã cải thiện điểm số đáng kể sau khi học với gia sư từ nền tảng này. Rất hài lòng với chất lượng giảng dạy!',
      rating: 5,
      avatar: '👩'
    },
    {
      id: 2,
      name: 'Trần Văn Minh',
      role: 'Học sinh lớp 12',
      content: 'Gia sư rất nhiệt tình và có phương pháp giảng dạy hiệu quả. Tôi đã tự tin hơn rất nhiều với môn Toán.',
      rating: 5,
      avatar: '👨‍🎓'
    },
    {
      id: 3,
      name: 'Phạm Thị Hoa',
      role: 'Phụ huynh học sinh lớp 8',
      content: 'Nền tảng rất tiện lợi, dễ sử dụng. Gia sư có lịch dạy linh hoạt, phù hợp với thời gian của gia đình.',
      rating: 5,
      avatar: '👩‍💼'
    }
  ];
  
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Phụ huynh & học sinh nói gì về chúng tôi
          </h2>
          <p className="text-gray-600 text-lg">
            Những đánh giá chân thực từ người dùng
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (// render từng phần tử một trong mảng tétimonials
            <div key={testimonial.id} className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (// lọc số sao đểm hiện thị số sao
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}