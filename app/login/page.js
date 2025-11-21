'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Đăng nhập thành công');
        router.push('/');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(data.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='min-h-screen bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4'>
      <div className='max-w-md w-full'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Đăng nhập
          </h1>
          <p className='text-gray-600'>
            Chào mừng bạn quay trở lại!
          </p>
        </div>
        
        <div className='bg-white rounded-xl shadow-2xl p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Email
              </label>
              <div className='relative'>
                <EnvelopeIcon className='h-5 w-5 text-gray-400 absolute left-3 top-3' />
                <input
                  type='email'
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className='input-field pl-10'
                  placeholder='email@example.com'
                />
              </div>
            </div>
            
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Mật khẩu
              </label>
              <div className='relative'>
                <LockClosedIcon className='h-5 w-5 text-gray-400 absolute left-3 top-3' />
                <input
                  type='password'
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className='input-field pl-10'
                  placeholder='••••••••'
                />
              </div>
            </div>
            
            <button
              type='submit'
              disabled={loading}
              className='w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          
          <div className='mt-6 text-center'>
            <p className='text-gray-600'>
              Chưa có tài khoản?{' '}
              <Link href='/register' className='text-primary-600 font-semibold hover:text-primary-700'>
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}