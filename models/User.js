import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db';

export async function createUser(userData) {// tạo người dùng
  const db = await getDatabase();
  const result = await db.collection('users').insertOne({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result;
}

export async function findUserByEmail(email) {// tìm người dùng bằng email
  const db = await getDatabase();
  return await db.collection('users').findOne({ email });
}

export async function findUserById(userId) {// tìm người dùng bằng id
  const db = await getDatabase();
  return await db.collection('users').findOne({ _id: new ObjectId(userId) });
}

export async function updateUser(userId, updateData) {// cập nhật thông tin người dùng
  const db = await getDatabase();
  return await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { 
      $set: { 
        ...updateData, 
        updatedAt: new Date() 
      } 
    }
  );
}