import jwt from 'jsonwebtoken';// thư viện tạo token
import bcrypt from 'bcrypt';// thư viện mã hóa mật khẩu

const JWT_SECRET = process.env.JWT_SECRET;// lấy jwt từ .env.local, cái này em sẽ để một file .env.example

export async function hashPassword(password) {// hàm mã hóa mật khẩu
  return await bcrypt.hash(password, 10);// mã hóa mật khẩu với 10 kí tự ngẫu nhiên
}

export async function verifyPassword(password, hashedPassword) {// so sánh mật khẩu người dùng nhập và mật khẩu trong db
  return await bcrypt.compare(password, hashedPassword);// hàm này của bcrypt
}

export function generateToken(userId, email) {// tạo token
  return jwt.sign(// tạo token chứa id người dùng và email
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }// quá 7 ngày token sẽ hết hạn va fphair đăng nhập lại để tạo token mới
  );
}

export function verifyToken(token) {// xác thực token
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(request) {// lấy thông tin người dùng từ req người dùng gửi ên
  try {
    const authHeader = request.headers.get('authorization');// lấy đoạn nội dụng chứa token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {// nếu k có đoạn nội dung và đoạn nội dung k bắt đầu bằn Bearer thì k thực hiện tiépp
      return null;
    }
    
    const token = authHeader.substring(7);//chỉ lấy token ở sau Bearer và xóa 'Bearer '
    const decoded = verifyToken(token);// thực hiện hàm xác thực token
    return decoded;
  } catch (error) {
    return null;
  }
}