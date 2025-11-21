// đây là code để tạo bố cục trang web
import './globals.css';// lấy các css từ file globals.css
import { ToastContainer } from 'react-toastify';// lấy phần tử chứa element thông báo
import 'react-toastify/dist/ReactToastify.css';//lấy css cuar thư viện react-toastify
import { Inter } from 'next/font/google';// lấy font inter từ google
import Navbar from '@/components/Navbar';// dòng 6, 7 là các component tự build trong /components
import Footer from '@/components/Footer';

const inter = Inter({//khởi tạo font inter
  subsets: ['latin', 'vietnamese']//lấy các kí tự latin mặc định và tiếng việt
});

export const metadata = {// đây là phần khởi tạo tiêu đề và mô tả của ưebsite
  title: 'Gia Sư Online - Nền tảng tìm gia sư uy tín',
  description: 'Kết nối gia sư chất lượng cao với học viên trên toàn quốc',
  icons: {
    icon: '/favicon.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang='vi'>
      <body className={`${inter.className} antialiased`}>{/** khai báo className của inter và tailwindcss */}
        <Navbar />{/** build component thanh điều hướng tại đây */}
        <main className='min-h-screen'>
          {children}{/** các phần tử con (khác) sẽ khác  hiển thị vvaf build ở đây*/}
        </main>
        <Footer />{/** phần chân trang */}
        <ToastContainer // khai báo khởi tạo element dành cho thong báo để luôn hiển thị dù có sáng href khác
          position='top-right'// vị trí trên cùng ben phải
          autoClose={3000}// tự động biến mất thông báo trong 3 giây
          closeOnClick// nhấn vào sẽ đóng luôn
          theme='light'//giao diện sáng
        />
      </body>
    </html>
  );
};