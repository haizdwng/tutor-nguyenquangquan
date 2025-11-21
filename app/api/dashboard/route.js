// các logic giống nhau em sẽ không giải thích lại ạ
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';// giải thích trong folder lib
import { getDatabase } from '@/lib/db';// giải thích trong folder lib
import { ObjectId } from 'mongodb';// hàm để chuyển id string sang objectId của mongodb

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }
    
    const db = await getDatabase();

    const userInfo = await db.collection('users').findOne(// tìm user trong collection users
      { _id: new ObjectId(user.userId) },// chuyển id string sang objectId để tìm
      { projection: { password: 0 } }// không lấy mật khẩu
    );
    
    const bookings = await db.collection('bookings')// lấy các booking từ collection "bookings" trong database
      .find({ userId: user.userId })// chỉ lấy các booking của user hiện tại
      .sort({ createdAt: -1 })// sắp xếp theo ngày tạo giảm dần
      .toArray();// chuyển thành mảng

    const totalBookings = bookings.length;// tổng số booking
    const paidBookings = bookings.filter(b => b.status === 'paid').length;// số booking đã thanh toán
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;// số booking đang chờ
    const totalSpent = bookings// tổng số tiền đã chi tiêu
      .filter(b => b.status === 'paid')// chỉ tính các booking đã thanh toán
      .reduce((sum, b) => sum + b.amount, 0);// tổng số tiền đã chi tiêu

    const today = new Date().toISOString().split('T')[0];// lấy ngày hiện tại ở định dạng YYYY-MM-DD
    const upcomingSchedule = bookings
      .filter(b => b.status === 'paid' && b.scheduleDate >= today)// chỉ lấy các booking đã thanh toán và có ngày học từ hôm nay trở đi
      .sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate))// sắp xếp theo ngày học tăng dần
      .slice(0, 5);// lấy 5 booking đầu tiên
    
    return NextResponse.json({// trả về dữ liệu dưới dạng json
      user: userInfo,
      stats: {
        totalBookings,
        paidBookings,
        pendingBookings,
        totalSpent
      },
      recentBookings: bookings.slice(0, 5),// lấy 5 booking gần đây nhất
      upcomingSchedule// các lịch học sắp tới
    });
    
  } catch (error) {// trả về nếu có lỗi xảy ra
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}