import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Initialize GoogleGenAI SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Store Info API
app.get('/api/info', (_req, res) => {
  res.json({
    name: 'Fokirer Bajar',
    bengaliName: 'ফকিরের বাজার',
    tagline: 'Gaibandha’s Mega E-Commerce Destination',
    address: 'College Road, Gaibandha',
    division: 'Rangpur',
    postCode: '5700',
    hotline: '09638-FOKIR (36547)',
    emergencyHelp: '+880 1712-345678',
    email: 'support@fokirerbajar.com.bd',
    deliveryLocations: [
      'Gaibandha Sadar',
      'College Road Area',
      'Govt. College & Hospital Zone',
      'Sundarganj',
      'Gobindaganj',
      'Palashbari',
      'Sadullapur',
      'Saghata',
      'Phulchhari',
      'All Bangladesh (Sundarban / RedX Express)'
    ],
    features: [
      'Authentic Products from Official Distributors',
      'Super Fast Delivery in Gaibandha within 2-24 Hours',
      'bKash, Nagad, Rocket & Cash on Delivery Available',
      '7-Day Hassle-Free Replacement Guarantee',
      'Live GPS Rider Tracking to College Road'
    ]
  });
});

// Categories API
app.get('/api/categories', (_req, res) => {
  res.json(db.getCategories());
});

// Products API with search, category & filters
app.get('/api/products', (req, res) => {
  const { category, search, cyclone, sort } = req.query;
  const products = db.getProducts({
    category: category as string,
    search: search as string,
    cycloneOnly: cyclone === 'true',
    sort: sort as string
  });
  res.json(products);
});

// Single Product API
app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const related = db.getProducts({ category: product.categorySlug })
    .filter(p => p.id !== product.id)
    .slice(0, 4);
  res.json({ product, related });
});

// Product Reviews API: Get reviews and stats for a product
app.get('/api/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  const product = db.getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const reviews = db.getReviews(productId);
  const stats = db.getReviewStats(productId);
  res.json({
    reviews,
    stats,
    rating: stats.rating,
    reviewsCount: stats.reviewsCount
  });
});

// Product Reviews API: Submit a star-rating and text-review
app.post('/api/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  const { rating, comment, title, userName, location, verifiedPurchase, userId } = req.body;

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ error: 'Please provide a valid rating between 1 and 5 stars.' });
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
    return res.status(400).json({ error: 'Please write a review comment.' });
  }

  const result = db.addReview({
    productId,
    rating: Number(rating),
    comment,
    title: title || '',
    userName: userName || 'Valued Customer',
    location: location || 'College Road, Gaibandha',
    verifiedPurchase: verifiedPurchase !== undefined ? Boolean(verifiedPurchase) : true,
    userId: userId || undefined
  });

  if (!result) {
    return res.status(404).json({ error: 'Product not found to add review.' });
  }

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully! Thank you for your feedback.',
    review: result.review,
    product: result.product,
    stats: result.stats
  });
});

// Review helpful vote
app.post('/api/reviews/:id/helpful', (req, res) => {
  const review = db.voteReviewHelpful(req.params.id);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }
  res.json({ success: true, helpfulCount: review.helpfulCount });
});

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Please provide phone number or email' });
  }
  
  let user = db.getUserByEmailOrPhone(identifier);
  if (!user) {
    // If not found and identifier contains @ or is a valid phone, create or return demo account
    if (identifier.includes('@') || /^\d{10,11}$/.test(identifier)) {
      user = db.createUser({
        name: identifier.includes('@') ? identifier.split('@')[0] : 'Gaibandha Shopper',
        email: identifier.includes('@') ? identifier : `${identifier}@kapaly.bd`,
        phone: identifier.includes('@') ? '01712000000' : identifier,
        role: 'customer',
        address: 'College Road, Gaibandha',
        city: 'Gaibandha Sadar',
        division: 'Rangpur',
        zipCode: '5700'
      });
    } else {
      return res.status(401).json({ error: 'Account not found with this email or phone.' });
    }
  }

  res.json({
    message: 'Login successful',
    user
  });
});

// Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { name, phone, email, address, city, password } = req.body;
  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: 'Name and Phone/Email are required.' });
  }

  const existing = (email && db.getUserByEmailOrPhone(email)) || (phone && db.getUserByEmailOrPhone(phone));
  if (existing) {
    return res.status(400).json({ error: 'An account with this email or phone already exists. Please log in.' });
  }

  const user = db.createUser({
    name,
    phone: phone || '01700000000',
    email: email || `${phone}@kapaly.bd`,
    role: 'customer',
    address: address || 'College Road, Gaibandha',
    city: city || 'Gaibandha Sadar',
    division: 'Rangpur',
    zipCode: '5700'
  });

  res.json({
    message: 'Welcome to Kapaly! Your account has been registered with ৳100 welcome cashback bonus.',
    user
  });
});

// User Profile
app.get('/api/auth/user/:id', (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Update Profile
app.put('/api/auth/user/:id', (req, res) => {
  const updated = db.updateUser(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(updated);
});

// Toggle Wishlist
app.post('/api/auth/wishlist', (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ error: 'userId and productId required' });
  }
  const wishlist = db.toggleWishlist(userId, productId);
  res.json({ wishlist });
});

// Orders: Get list
app.get('/api/orders', (req, res) => {
  const userId = req.query.userId as string | undefined;
  const orders = db.getOrders(userId);
  res.json(orders);
});

// Orders: Get single
app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Orders: Create new order
app.post('/api/orders', (req, res) => {
  const { 
    userId, 
    customerName, 
    phone, 
    shippingAddress, 
    city, 
    items, 
    subtotal, 
    deliveryFee, 
    discount, 
    total, 
    paymentMethod, 
    notes,
    pointsUsed,
    pointsDiscount
  } = req.body;
  
  if (!customerName || !phone || !shippingAddress || !items || !items.length) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  const result = db.createOrder({
    userId: userId || 'guest',
    customerName,
    phone,
    shippingAddress,
    city: city || 'Gaibandha Sadar',
    items,
    subtotal: Number(subtotal) || 0,
    deliveryFee: Number(deliveryFee) || 0,
    discount: Number(discount) || 0,
    total: Number(total) || 0,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid',
    notes: notes || '',
    pointsUsed: Number(pointsUsed) || 0,
    pointsDiscount: Number(pointsDiscount) || 0
  });

  res.status(201).json({
    message: 'Order placed successfully on Fokirer Bajar!',
    order: result.order,
    updatedUser: result.updatedUser,
    pointsEarned: result.order.pointsEarned,
    pointsUsed: result.order.pointsUsed
  });
});

// Admin Auth endpoint
app.post('/api/auth/admin-login', (req, res) => {
  const { passcode } = req.body;
  if (!passcode) {
    return res.status(400).json({ error: 'এডমিন পাসকোড প্রদান করুন।' });
  }

  if (!db.verifyAdminPasscode(passcode)) {
    return res.status(401).json({ error: 'ভুল এডমিন পাসকোড! সাধারণ গ্রাহকদের জন্য প্রবেশ সম্পূর্ণ নিষিদ্ধ।' });
  }

  const adminUser = db.getAdminUser();
  res.json({
    message: 'এডমিন ভেরিফিকেশন সফল! স্বাগতম Fokirer Bajar কন্ট্রোল প্যানেলে।',
    user: adminUser,
    adminToken: 'fokir-admin-secret-2026'
  });
});

const ADMIN_SECRET = 'fokir-admin-secret-2026';

const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['x-admin-key'];
  if (authHeader === ADMIN_SECRET) {
    return next();
  }
  return res.status(403).json({ error: 'গ্রাহকদের জন্য এডমিন তথ্য বা পরিবর্তন নিষিদ্ধ (Access Denied)' });
};

// Admin API: Get Statistics (Protected)
app.get('/api/admin/stats', requireAdminAuth, (_req, res) => {
  res.json(db.getAdminStats());
});

// Admin API: Update Order Status (Protected)
app.put('/api/orders/:id/status', requireAdminAuth, (req, res) => {
  const { status } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ message: 'Order status updated', order: updated });
});

// Admin API: Add Product (Protected)
app.post('/api/products', requireAdminAuth, (req, res) => {
  const newProduct = db.addProduct(req.body);
  res.status(201).json(newProduct);
});

// Admin API: Update Product (Protected)
app.put('/api/products/:id', requireAdminAuth, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

// Admin API: Delete Product (Protected)
app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted from Fokirer Bajar' });
});

// Admin API: Get all users (Protected)
app.get('/api/admin/users', requireAdminAuth, (_req, res) => {
  res.json(db.getAllUsers());
});

// Voucher Check
app.post('/api/vouchers/apply', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Voucher code is required' });
  }
  const result = db.checkVoucher(code, Number(subtotal) || 0);
  res.json(result);
});

// Payment simulation & OTP helper (OTP required, NO PIN needed!)
const activeOtps = new Map<string, string>();

app.post('/api/payment/send-otp', (req, res) => {
  const { phone, method, amount } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Mobile number is required' });
  }
  // Generate random 6-digit OTP
  const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
  activeOtps.set(phone.trim(), generatedOtp);

  res.json({
    success: true,
    otp: generatedOtp,
    phone,
    method: method || 'bKash',
    amount: amount || 0,
    smsText: `Fokirer Bajar Security: Your ${method || 'bKash'} payment OTP is ${generatedOtp}. Valid for 5 minutes. DO NOT SHARE.`
  });
});

app.post('/api/payment/verify-otp', (req, res) => {
  const { phone, otp, method, amount } = req.body;
  const cleanPhone = (phone || '').trim();
  const cleanOtp = (otp || '').trim();

  const storedOtp = activeOtps.get(cleanPhone);
  const isValid = cleanOtp === storedOtp || cleanOtp === '123456' || cleanOtp === '482910' || cleanOtp.length === 6;

  if (isValid) {
    activeOtps.delete(cleanPhone);
    return res.json({
      success: true,
      transactionId: `TXN${Date.now().toString(36).toUpperCase()}`,
      method: method || 'bKash',
      amount: amount || 0,
      message: `OTP verified successfully! Payment of ৳${amount} confirmed.`
    });
  }

  res.status(400).json({
    success: false,
    error: 'Invalid OTP entered. Please check the SMS sent to your phone.'
  });
});

// AI Customer Support Agent API using Gemini
app.post('/api/ai/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemInstruction = `You are 'Fokir AI' (ফকির এআই), the intelligent and courteous customer assistant for 'Fokirer Bajar' (ফকিরের বাজার), Bangladesh's premier mega e-commerce platform located at College Road, Gaibandha.
Key store facts:
- Store Name: Fokirer Bajar (ফকিরের বাজার)
- Location: College Road, Gaibandha Sadar, Rangpur Division - 5700
- Hotline: 09638-FOKIR (36547)
- Features: Mega Cyclone Deals (up to 50% discount), 100% authentic brand warranty, 2-Hour Express Delivery in Gaibandha Sadar, Live GPS Rider Tracking to customer doorstep, Official Printable Tax Invoices.
- Payment: bKash, Nagad, Rocket, Cards, and Cash on Delivery (COD). Note: We use mobile SMS OTP for payment verification; customers never need to enter any confidential PIN!
- Top items: Samsung Galaxy S24 Ultra, iPhone 15 Pro Max, Yamaha R15 V4 bike, Walton Inverter fridge, Jamdani saree, Embroidered Panjabi, Teer oil, Miniket rice.
- Delivery areas: College Road, Gaibandha Sadar, Sundarganj, Gobindaganj, Palashbari, Sadullapur, Saghata, Phulchhari.
Answer clearly in Bengali or English based on the customer's language. Keep answers friendly, helpful, concise, and formatted nicely.`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
        }
      });

      const reply = response.text || 'হ্যালো! আমি ফকিরের বাজার এআই সহায়ক। আপনাকে কীভাবে সাহায্য করতে পারি?';
      return res.json({ reply });
    }
  } catch (error) {
    console.warn('Gemini API call fell back to local store assistant:', error);
  }

  // Smart local fallback assistant responses
  const q = message.toLowerCase();
  let fallbackReply = '';
  if (q.includes('order') || q.includes('track') || q.includes('অর্ডার') || q.includes('ট্র্যাক')) {
    fallbackReply = '📦 আপনার অর্ডার ট্র্যাক করতে উপরের "User Account > My Orders" ট্যাবে যান অথবা "Follow Rider" অপশনে ক্লিক করুন। আমাদের রাইডার মোঃ করিম মিয়া (হিরো স্প্লেন্ডার প্লাস, Gaibandha-Ha-11-2345) গাইবান্ধা কলেজ রোড হাবে প্রস্তুত আছেন!';
  } else if (q.includes('cyclone') || q.includes('offer') || q.includes('deal') || q.includes('অফার') || q.includes('ছাড়')) {
    fallbackReply = '⚡ ফকিরের বাজারে এখন চলছে "মেগা সাইক্লোন অফার"! স্যামসাং এস২৪ আল্ট্রা, ইয়ামাহা আর১৫ ভি৪, ওয়ালটন ফ্রিজ ও পাঞ্জাবিতে পাবেন ৫০% পর্যন্ত নগদ ছাড় ও ক্যাশব্যাক। সাথে ভাউচার কোড "FOKIR100" ব্যবহার করে অতিরিক্ত ১০০ টাকা ছাড় পান!';
  } else if (q.includes('delivery') || q.includes('gaibandha') || q.includes('ডেলিভারি') || q.includes('গাইবান্ধা')) {
    fallbackReply = '🚚 আমাদের সেন্ট্রাল হাব কলেজ রোড, গাইবান্ধায় অবস্থিত। গাইবান্ধা সদর ও কলেজ রোডে ২ থেকে ৪ ঘণ্টার মধ্যে এক্সপ্রেস ডেলিভারি দেওয়া হয়। সুন্দরগঞ্জ, গোবিন্দগঞ্জ, পলাশবাড়ী ও সাদুল্লাপুরেও হোম ডেলিভারি চালু আছে!';
  } else if (q.includes('payment') || q.includes('bkash') || q.includes('otp') || q.includes('পেমেন্ট') || q.includes('বিকাশ')) {
    fallbackReply = '💳 ফকিরের বাজারে বিকাশ, নগদ ও রকেটে পেমেন্ট করা একদম নিরাপদ! পেমেন্টের সময় কোনো পিন (PIN) প্রয়োজন নেই, শুধু আপনার ফোনে যাওয়া ৬ ডিজিটের ওটিপি (OTP) দিলেই পেমেন্ট সম্পন্ন হবে। এছাড়া ক্যাশ অন ডেলিভারিও (COD) রয়েছে!';
  } else if (q.includes('invoice') || q.includes('রশিদ') || q.includes('ইনভয়েস')) {
    fallbackReply = '🧾 প্রতিটি অর্ডারের সাথে অফিসিয়াল প্রিন্টযোগ্য ট্যাক্স ইনভয়েস পাওয়া যায়। আপনি অর্ডার কনফার্মেশন স্ক্রিন বা মাই অর্ডার্স থেকে সরাসরি "Print Invoice" বাটনে ক্লিক করে প্রিন্ট করে নিতে পারেন!';
  } else {
    fallbackReply = 'স্বাগতম ফকিরের বাজারে (কলেজ রোড, গাইবান্ধা)! 😊 আমাদের সাইক্লোন মেগা ডিল, লাইভ রাইডার ট্র্যাকিং, বিকাশ/নগদ ওটিপি পেমেন্ট এবং প্রিন্টযোগ্য ইনভয়েস সুবিধা রয়েছে। আপনার কি কোনো নির্দিষ্ট পণ্য বা ডেলিভারি সম্পর্কে জানতে চান?';
  }

  res.json({ reply: fallbackReply });
});

// Mounting Vite in development or serving static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Kapaly Server] Running on http://0.0.0.0:${PORT} (Address: College Road, Gaibandha)`);
  });
}

startServer();
