import { ObjectId } from 'mongodb';
import { getDatabase } from '../lib/db';

export async function getAllTutors(limit = 50) {
  const db = await getDatabase();
  return await db.collection('tutors')// kết nối đến thư mục tutors trong db để lấy thông tin tất cả gia sư
    .find({})// tìm và lấy tất cả
    .limit(limit)// giới hạn, giá trị em truyền vào 50
    .toArray();// chuyển thành mảng
}

export async function getTutorById(tutorId) {// lấy thông tin một gia sư duy nhất bằng id của gia sư đó
  const db = await getDatabase();
  return await db.collection('tutors').findOne({ _id: new ObjectId(tutorId) });// hàm lấy thông tin gia sư bằng id
}

export async function searchTutors(filters = {}) {// hàm tìm kiếm gia sư
  const db = await getDatabase();
  const query = {};
  
  if (filters.keyword) {// nếu có từ khóa
    query.$or = [
      { name: { $regex: filters.keyword, $options: 'i' } },
      { subject: { $regex: filters.keyword, $options: 'i' } }
    ];
  }
  
  if (filters.subject) {// nếu có môn học
    query.subject = { $regex: filters.subject, $options: 'i' };
  }
  
  if (filters.minPrice || filters.maxPrice) {// nếu có số tiền tối thiểu và tối đa
    query.pricePerHour = {};
    if (filters.minPrice) query.pricePerHour.$gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) query.pricePerHour.$lte = parseFloat(filters.maxPrice);
  }
  
  if (filters.minRating) {// nếu có số sao
    query.rating = { $gte: parseFloat(filters.minRating) };
  }
  
  return await db.collection('tutors').find(query).toArray();// tìm và chuyển thành mảng
}

export async function createTutor(tutorData) {// tạo gia sư// hàm này em chưa dùng đến tại vì em chưa cho tính năng gia sư tự đăng ký tài khảon
  const db = await getDatabase();
  return await db.collection('tutors').insertOne({
    ...tutorData,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function updateTutorRating(tutorId, newRating) {// cập nhật số sao dựa vào id gia sư và số sao
  const db = await getDatabase();
  const tutor = await getTutorById(tutorId);
  
  if (!tutor) return null;
  
  const currentTotal = tutor.rating * tutor.reviewCount;
  const newReviewCount = tutor.reviewCount + 1;
  const newAvgRating = (currentTotal + newRating) / newReviewCount;
  
  return await db.collection('tutors').updateOne(
    { _id: new ObjectId(tutorId) },
    {
      $set: {
        rating: Math.round(newAvgRating * 10) / 10,
        reviewCount: newReviewCount,
        updatedAt: new Date()
      }
    }
  );
}