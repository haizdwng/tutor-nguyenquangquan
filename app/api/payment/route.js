import { NextResponse } from 'next/server';
import { PayOS } from '@payos/node';//lấy hàm PayOS từ thư viện payos để sử dụng dịch vụ thanh toán
import { getUserFromRequest } from '@/lib/auth';
import { getTutorById } from '@/models/Tutor';
import { getDatabase } from '@/lib/db';
// mấy cái kia em giải thích trong folder tương ứng rồi ạ
const payos = new PayOS({// cấu hình kết nối với PayOS, các biến này lấy trong .env.local
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập để thanh toán' },
        { status: 401 }
      );
    }
    
    const { tutorId, hours, scheduleDate, scheduleTime } = await request.json();// laays id gia sư, số giờ, ngày và giờ học từ request
    
    if (!tutorId || !hours || !scheduleDate || !scheduleTime) {// nếu thiếu thong tin thì trar về lõi
      return NextResponse.json(
        { error: 'Thiếu thông tin thanh toán' },
        { status: 400 }
      );
    }
    
    const tutor = await getTutorById(tutorId);
    if (!tutor) {
      return NextResponse.json(
        { error: 'Không tìm thấy gia sư' },
        { status: 404 }
      );
    }
    
    const amount = tutor.pricePerHour * parseInt(hours);// tính tổng tiền cần thanh toán
    const orderCode = Number(String(Date.now()).slice(-9));// tạo mã đơn hàng dựa trên thời gian hiện tại
    
    const paymentData = {// dữ liêu để guiwrcho páyos
      orderCode: orderCode,
      amount: amount,
      description: `${tutor.name} - ${hours} hours`,
      returnUrl: `http://localhost:3000/payment-success`,
      cancelUrl: `http://localhost:3000/payment-cancel`
    };
    
    const paymentLinkReq = await payos.paymentRequests.create(paymentData);// tạo yêu câu fthanh toán
    const paymentLinkRes = await paymentLinkReq;// chờ phản hồi và lấy dữ liệu payos gửi lại
    
    const db = await getDatabase();
    await db.collection('bookings').insertOne({// lưu thông tin đơn hàng vào database trong thư mục bookings
      userId: user.userId,
      tutorId: tutorId,
      tutorName: tutor.name,
      hours: parseInt(hours),
      amount: amount,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime,
      orderCode: orderCode,
      status: 'pending',
      createdAt: new Date()
    });
    
    return NextResponse.json({
      paymentUrl: paymentLinkRes.checkoutUrl,// trả về đường link thanh toán
      orderCode: orderCode
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tạo thanh toán' },
      { status: 500 }
    );
  }
}

export async function GET(request) {// xử lý yêu cầu lấy thông tin thanh toán
  try {
    const { searchParams } = new URL(request.url);// lấy tham số tìm kiếm từ URL
    const orderCode = searchParams.get('orderCode');// lấy mã đơn hàng từ tham số
    
    if (!orderCode) {// nếu thiếu mã đơn hàng thì trả về lỗi
      return NextResponse.json(
        { error: 'Thiếu orderCode' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const booking = await db.collection('bookings').findOne({// tìm đơn hàng trong database dựa trên mã đơn hàng
      orderCode: parseInt(orderCode)
    });
    
    if (!booking) {// nếu không tìm thấy đơn hàng thì trả về lỗi
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ booking });
    
  } catch (error) {// xử lý lỗi khi lấy thông tin thanh toán
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}