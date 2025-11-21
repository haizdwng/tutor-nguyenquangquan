import { NextResponse } from 'next/server';
import { getTutorById } from '@/models/Tutor';
// em giải thích trong thư mucj tuowng ứng rồi nhses ạ
export async function GET(request, { params }) {// nhận id từ params
  try {
    const { id } = await params;// lấy id từ params
    
    if (!id) {// nếu không có id thì trả về lỗi
      return NextResponse.json(
        { error: 'Thiếu ID gia sư' },
        { status: 400 }
      );
    }
    
    const tutor = await getTutorById(id);// lấy thông tin gia sư theo id
    
    if (!tutor) {// nếu không tìm thấy gia sư thì trả về lỗi
      return NextResponse.json(
        { error: 'Không tìm thấy gia sư' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ tutor });// trả về thông tin gia sư
    
  } catch (error) {// nếu có lỗi xảy ra thì trả về lỗi
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy thông tin gia sư' },
      { status: 500 }
    );
  }
}