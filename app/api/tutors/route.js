import { NextResponse } from 'next/server';
import { getAllTutors, searchTutors, createTutor } from '@/models/Tutor';
import { getUserFromRequest } from '@/lib/auth';
// em sẽ giải thích trong các folder tương ứng

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);// lấy các tham số truy vấn từ URL
    const keyword = searchParams.get('keyword');// lấy tham số 'keyword' từ URL
    const subject = searchParams.get('subject');// lấy tham số 'subject' từ URL
    const minPrice = searchParams.get('minPrice');// lấy tham số 'minPrice' từ URL
    const maxPrice = searchParams.get('maxPrice');// lấy tham số 'maxPrice' từ URL
    const minRating = searchParams.get('minRating');// lấy tham số 'minRating' từ URL
    
    let tutors;
    
    if (keyword || subject || minPrice || maxPrice || minRating) {// nếu có bất kỳ tham số tìm kiếm nào được cung cấp thì gọi hàm tìm kiếm gia sư
      tutors = await searchTutors({
        keyword,
        subject,
        minPrice,
        maxPrice,
        minRating
      });
    } else {// nếu không có tham số tìm kiếm nào được cung cấp thì lấy tất cả gia sư
      tutors = await getAllTutors();
    }
    
    return NextResponse.json({// trả về danh sách gia sư dưới dạng JSON
      tutors,
      count: tutors.length
    });
    
  } catch (error) {// xử lý lỗi
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy danh sách gia sư' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);// lấy thông tin người dùng từ req
    if (!user) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }
    
    const tutorData = await request.json();
    
    const { name, subject, pricePerHour, experience, avatar, schedule } = tutorData;// lấy dữ liệu gia sư từ req
    
    if (!name || !subject || !pricePerHour || !experience) {// nếu thiếu thông tin bắt buộc thì trả về lỗi
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }
    
    const result = await createTutor({// tạo hồ sơ gia sư mới trong dâtbase
      name,
      subject,
      pricePerHour: parseFloat(pricePerHour),
      experience,
      avatar: avatar,
      schedule: schedule,
      userId: user.userId
    });
    
    return NextResponse.json({
      message: 'Tạo hồ sơ gia sư thành công',
      tutorId: result.insertedId.toString()
    }, { status: 201 });
    
  } catch (error) {// xử lý lỗi khi tạo hồ sơ gia sư
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tạo hồ sơ gia sư' },
      { status: 500 }
    );
  }
}