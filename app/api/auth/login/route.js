import { NextResponse } from 'next/server';// hàm phản hồi từ Next.js
import { findUserByEmail } from '@/models/User';// nhập hàm tìm người dùng theo email// cái dòng 2 và 3 này em sẽ giải thích trong folder models
import { verifyPassword, generateToken } from '@/lib/auth';// nhập hàm xác minh mật khẩu và tạo token

export async function POST(request) {// xử lý req người dùng gửi đến bao gồm email và mật khẩu
  try {
    const { email, password } = await request.json();// lấy email và mật khẩu từ req
    
    if (!email || !password) {// nếu không có email hoặc mật khẩu thì trả về lỗi
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }
    
    const user = await findUserByEmail(email);// tìm người dùng trong database theo email
    if (!user) {// nếu không tìm thấy người dùng thì trả về lỗi
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    const isValidPassword = await verifyPassword(password, user.password);// xác minh mật khẩu người dùng nhập vào với mật khẩu đã lưu trong database
    if (!isValidPassword) {// nếu mật khẩu không đúng thì trả về lỗi
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    const token = generateToken(user._id.toString(), user.email);// tạo token xác thực cho người dùng với id và email
    
    return NextResponse.json({// trả về phản hồi thành công kèm token và thông tin người dùng
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      }
    });
    
  } catch (error) {// xử lý các lỗi trong quá trình thực hiện các bước trên và trả về lỗi
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đăng nhập' },
      { status: 500 }
    );
  }
}