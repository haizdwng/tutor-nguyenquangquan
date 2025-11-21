import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { updateTutorRating } from '@/models/Tutor';
import { ObjectId } from 'mongodb';
// em giải thích trong folder tương ứng rồi ạ

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }
    
    const { tutorId, rating, comment } = await request.json();// lấy id gia sư, đánh giá, bình luận từ request
    
    if (!tutorId || !rating) {
      return NextResponse.json(
        { error: 'Thiếu thông tin đánh giá' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {// nếu đánh giá dưới 1 hoặc trên 5 thì trả về lỗi
      return NextResponse.json(
        { error: 'Đánh giá phải từ 1 đến 5 sao' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    
    const paidBooking = await db.collection('bookings').findOne({// tìm đơn hàng đã thanh toán trong database
      userId: user.userId,// chỉ người dùng đã thuê gia sư mới được đánh giá
      tutorId: tutorId,// gia sư được đánh giá
      status: 'paid'// thanh toán rồi mới được đánh giá
    });
    
    if (!paidBooking) {// nếu không tìm thấy đơn hàng đã thanh toán thì trả về lỗi
      return NextResponse.json(
        { error: 'Bạn chỉ có thể đánh giá gia sư đã thuê' },
        { status: 403 }
      );
    }
    
    const existingReview = await db.collection('reviews').findOne({// kiểm tra xem người dùng đã đánh giá gia sư này chưa
      userId: user.userId,
      tutorId: tutorId
    });
    
    if (existingReview) {// nếu đã đánh giá rồi thì trả về lỗi
      return NextResponse.json(
        { error: 'Bạn đã đánh giá gia sư này rồi' },
        { status: 400 }
      );
    }
    
    await db.collection('reviews').insertOne({// chèn đánh giá mới vào database
      userId: user.userId,
      tutorId: tutorId,
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: new Date()
    });
    
    await updateTutorRating(tutorId, parseInt(rating));// cập nhật đánh giá trung bình của gia sư
    
    return NextResponse.json({
      message: 'Đánh giá thành công'
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đánh giá' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);// lấy tham số tìm kiếm từ URL
    const tutorId = searchParams.get('tutorId');// lấy tutorId từ tham số tìm kiếm
    
    if (!tutorId) {
      return NextResponse.json(
        { error: 'Thiếu tutorId' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const reviews = await db.collection('reviews')// lấy tất cả đánh giá của gia sư từ database
      .find({ tutorId: tutorId })// chỉ lấy đánh giá của gia sư có tutorId tương ứng
      .sort({ createdAt: -1 })// sắp xếp theo ngày tạo giảm dần
      .toArray();// chuyển kết quả thành mảng
    
    const reviewsWithUsers = await Promise.all(// thêm tên người dùng vào mỗi đánh giá
      reviews.map(async (review) => {// duyệt qua từng đánh giá
        const user = await db.collection('users').findOne(// lấy thông tin người dùng từ database
          { _id: new ObjectId(review.userId) },// chỉ lấy người dùng có _id tương ứng
          { projection: { name: 1 } }// chỉ lấy tên người dùng
        );
        return { // trả về đánh giá kèm tên người dùng
          ...review,
          userName: user?.name || 'Người dùng'
        };
      })
    );
    
    return NextResponse.json({// trả về danh sách đánh giá kèm tên người dùng và tổng số đánh giá
      reviews: reviewsWithUsers,
      count: reviewsWithUsers.length
    });
    
  } catch (error) {// nếu có lỗi xảy ra thì trả về lỗi
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}