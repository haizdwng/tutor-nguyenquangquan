// giống cấu trúc của login, nhưng ở đây là đăng ký tài khoản mới
import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/models/User';// tương tự em sẽ giải thích trong folder models
import { hashPassword, generateToken } from '@/lib/auth';// tương tự em sẽ giải thích trong folder lib

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {// nếu độ dài mật khẩu dưới 6 ký tự thì trả về lỗi
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }
    
    const existingUser = await findUserByEmail(email);// kiểm tra xem email đã được sử dụng chưa
    if (existingUser) {// nếu email sử dụng rồi thì trả về lỗi
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await hashPassword(password);// mã hóa mật khẩu trước khi lưu vào database
    
    const result = await createUser({// tạo người dùng mới trong database với email, mật khẩu đã mã hóa, tên và vai trò
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });
    
    const token = generateToken(result.insertedId.toString(), email);// tạo token cho người dùng với id và email
    
    return NextResponse.json({// trả về phản hồi thành công kèm token và thông tin người dùng
      message: 'Đăng ký thành công',
      token,
      user: {
        id: result.insertedId.toString(),
        email,
        name
      }
    }, { status: 201 });
    
  } catch (error) {// xử lý các lỗi trong quá trình thực hiện các bước trên và trả về lỗi
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đăng ký' },
      { status: 500 }
    );
  }
}