// các logic tương tự em sẽ không giải thích nữa ạ
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';// giải thích trong folder lib
import { getDatabase } from '@/lib/db';// giải thích trong folder lib

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);// lấy thông tin người dùng từ request
    if (!user) {// nếu không có người dùng thì trả về lỗi
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);// lấy các tham số tìm kiếm từ URL
    const status = searchParams.get('status');// lấy giá trị của tham số "status"
    
    const db = await getDatabase();
    
    const query = { userId: user.userId };// chỉ lấy các booking của người dùng hiện tại
    if (status) {// nếu có tham số status thì thêm vào query
      query.status = status;
    }
    
    const bookings = await db.collection('bookings')// lấy các booking từ collection "bookings" trong database
      .find(query)// áp dụng query đã tạo
      .sort({ createdAt: -1 })// sắp xếp theo thời gian tạo giảm dần
      .toArray();// chuyển thành mảng
    
    return NextResponse.json({// trả về danh sách booking và số lượng
      bookings,
      count: bookings.length
    });
    
  } catch (error) {// xử lý lỗi khi lấy danh sách booking và trả về lỗi
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}