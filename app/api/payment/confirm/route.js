import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request) {
  try {
    const { orderCode, status } = await request.json();// lấy mã thanh toán và trạng thái từ req người dùng gửi
    if (!orderCode) {// nếu thiếu mã thanh toán trả về lỗi
      return NextResponse.json(
        { error: 'Thiếu orderCode' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    await db.collection('bookings').updateOne(// cập nhật trạng thái thanh toán trong db
      { orderCode: parseInt(orderCode) },
      {
        $set: {// nếu trạng thái là 'success' thì đặt trạng thái thanh toán là 'paid', ngược lại là 'failed'
          status: status === 'success' ? 'paid' : 'failed',
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({// trả về phản hồi thành công
      message: 'Cập nhật trạng thái thanh toán thành công'
    });
    
  } catch (error) {// trả về lỗi nếu có lỗi xảy ra
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}