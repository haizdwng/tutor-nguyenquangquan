import { MongoClient } from 'mongodb';// lấy hàm khởi tạo client của mongodb

const uri = process.env.MONGODB_URI;// lấy uri từ .env.local
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {// nếu k chạy lệnh npm run dev thì
  if (!global._mongoClientPromise) {// nếu chưa có _mongoClientPromise trong biến global thì
    client = new MongoClient(uri, options);// khởi tạo client với ủi và options
    global._mongoClientPromise = client.connect();// lưu client.connect() và biến global
  }
  clientPromise = global._mongoClientPromise;
} else {// nếu chạy npm run build hoặc ở trong môi trường đã deploy thì
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase() {// hàm lấy db
  const client = await clientPromise;
  return client.db('tutor');// lấy từ database tutor
}