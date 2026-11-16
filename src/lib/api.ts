import { Category, Order, Product, Review, StoreInfo, User } from '../types.ts';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const EXPLICIT_STATIC_ONLY = import.meta.env.VITE_STATIC_ONLY === 'true';

let runtimeStaticFallback = false;

export function isStaticOnlyMode(): boolean {
  if (API_BASE_URL) return false;
  if (EXPLICIT_STATIC_ONLY || runtimeStaticFallback) return true;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.endsWith('.github.io') || window.location.protocol === 'file:') {
      return true;
    }
  }
  return false;
}

export function markStaticFallbackActive(): void {
  if (!API_BASE_URL) {
    runtimeStaticFallback = true;
  }
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  if (isStaticOnlyMode()) {
    return new Response(JSON.stringify({ staticMode: true }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const res = await fetch(apiUrl(path), init);
  const contentType = res.headers.get('content-type') || '';
  if (res.status === 404 || (!res.ok && contentType.includes('text/html'))) {
    markStaticFallbackActive();
  }
  return res;
}

export const STATIC_STORE_INFO: StoreInfo = {
  name: 'Fokirer Bajar',
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
};

export interface StaticFallbackDb {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  orders: Order[];
  vouchers: Array<{
    code: string;
    discountType: 'fixed' | 'percent';
    value: number;
    minOrder: number;
    description: string;
  }>;
}

let cachedFallbackDb: StaticFallbackDb | null = null;

export async function loadStaticFallbackDb(): Promise<StaticFallbackDb> {
  if (cachedFallbackDb) return cachedFallbackDb;
  try {
    const base = import.meta.env.BASE_URL || '/';
    const url = `${base.endsWith('/') ? base : `${base}/`}fallback-db.json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      cachedFallbackDb = {
        products: Array.isArray(data?.products) ? data.products : [],
        categories: Array.isArray(data?.categories) ? data.categories : [],
        reviews: Array.isArray(data?.reviews) ? data.reviews : [],
        orders: Array.isArray(data?.orders) ? data.orders : [],
        vouchers: Array.isArray(data?.vouchers) ? data.vouchers : []
      };
      return cachedFallbackDb;
    }
  } catch {
    // Ignore fallback load failures
  }
  return { products: [], categories: [], reviews: [], orders: [], vouchers: [] };
}

export const STATIC_ADMIN_USER: User = {
  id: 'usr_admin_01',
  name: 'Fokir Central Admin',
  phone: '01700000001',
  email: 'admin@fokirerbajar.com.bd',
  role: 'admin',
  address: 'Fokirer Bajar HQ, College Road, Gaibandha',
  city: 'Gaibandha Sadar',
  division: 'Rangpur',
  zipCode: '5700',
  balance: 0,
  points: 0,
  createdAt: '2025-01-01T00:00:00.000Z',
  wishlist: []
};

export function getStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStoredJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export function getLocalAiReply(message: string): string {
  const q = message.toLowerCase();
  if (q.includes('order') || q.includes('track') || q.includes('অর্ডার') || q.includes('ট্র্যাক')) {
    return '📦 আপনার অর্ডার ট্র্যাক করতে উপরের "User Account > My Orders" ট্যাবে যান অথবা "Follow Rider" অপশনে ক্লিক করুন। আমাদের রাইডার মোঃ করিম মিয়া (হিরো স্প্লেন্ডার প্লাস, Gaibandha-Ha-11-2345) গাইবান্ধা কলেজ রোড হাবে প্রস্তুত আছেন!';
  }
  if (q.includes('cyclone') || q.includes('offer') || q.includes('deal') || q.includes('অফার') || q.includes('ছাড়')) {
    return '⚡ ফকিরের বাজারে এখন চলছে "মেগা সাইক্লোন অফার"! স্যামসাং এস২৪ আল্ট্রা, ইয়ামাহা আর১৫ ভি৪, ওয়ালটন ফ্রিজ ও পাঞ্জাবিতে পাবেন ৫০% পর্যন্ত নগদ ছাড় ও ক্যাশব্যাক। সাথে ভাউচার কোড "FOKIR100" ব্যবহার করে অতিরিক্ত ১০০ টাকা ছাড় পান!';
  }
  if (q.includes('delivery') || q.includes('gaibandha') || q.includes('ডেলিভারি') || q.includes('গাইবান্ধা')) {
    return '🚚 আমাদের সেন্ট্রাল হাব কলেজ রোড, গাইবান্ধায় অবস্থিত। গাইবান্ধা সদর ও কলেজ রোডে ২ থেকে ৪ ঘণ্টার মধ্যে এক্সপ্রেস ডেলিভারি দেওয়া হয়। সুন্দরগঞ্জ, গোবিন্দগঞ্জ, পলাশবাড়ী ও সাদুল্লাপুরেও হোম ডেলিভারি চালু আছে!';
  }
  if (q.includes('payment') || q.includes('bkash') || q.includes('otp') || q.includes('পেমেন্ট') || q.includes('বিকাশ')) {
    return '💳 ফকিরের বাজারে বিকাশ, নগদ ও রকেটে পেমেন্ট করা একদম নিরাপদ! পেমেন্টের সময় কোনো পিন (PIN) প্রয়োজন নেই, শুধু আপনার ফোনে যাওয়া ৬ ডিজিটের ওটিপি (OTP) দিলেই পেমেন্ট সম্পন্ন হবে। এছাড়া ক্যাশ অন ডেলিভারিও (COD) রয়েছে!';
  }
  if (q.includes('invoice') || q.includes('রশিদ') || q.includes('ইনভয়েস')) {
    return '🧾 প্রতিটি অর্ডারের সাথে অফিসিয়াল প্রিন্টযোগ্য ট্যাক্স ইনভয়েস পাওয়া যায়। আপনি অর্ডার কনফার্মেশন স্ক্রিন বা মাই অর্ডার্স থেকে সরাসরি "Print Invoice" বাটনে ক্লিক করে প্রিন্ট করে নিতে পারেন!';
  }
  return 'স্বাগতম ফকিরের বাজারে (কলেজ রোড, গাইবান্ধা)! 😊 আমাদের সাইক্লোন মেগা ডিল, লাইভ রাইডার ট্র্যাকিং, বিকাশ/নগদ ওটিপি পেমেন্ট এবং প্রিন্টযোগ্য ইনভয়েস সুবিধা রয়েছে। আপনি কি কোনো নির্দিষ্ট পণ্য বা ডেলিভারি সম্পর্কে জানতে চান?';
}

export function createLocalDemoOrder(payload: any): Order {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const trackingNumber = `FKR-GBD-${randomDigits}`;
  return {
    id: `ord_local_${Date.now()}`,
    userId: payload.userId || 'guest_user',
    customerName: payload.customerName,
    phone: payload.phone,
    shippingAddress: payload.shippingAddress,
    city: payload.city || 'Gaibandha Sadar',
    items: payload.items || [],
    subtotal: Number(payload.subtotal) || 0,
    deliveryFee: Number(payload.deliveryFee) || 0,
    discount: Number(payload.discount) || 0,
    total: Number(payload.total) || 0,
    paymentMethod: payload.paymentMethod || 'COD',
    paymentStatus: payload.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid',
    orderStatus: 'Confirmed',
    createdAt: new Date().toISOString(),
    estimatedDelivery: '2-4 Hours Express (Gaibandha Hub)',
    trackingNumber,
    invoiceNumber: `INV-FB-${new Date().getFullYear()}-${randomDigits}`,
    notes: payload.notes || '',
    pointsEarned: Math.max(1, Math.floor((Number(payload.total) || 0) / 20)),
    pointsUsed: Number(payload.pointsUsed) || 0,
    pointsDiscount: Number(payload.pointsDiscount) || 0,
    rider: {
      id: 'rdr-01',
      name: 'Md. Karim Mia',
      bengaliName: 'মোঃ করিম মিয়া',
      phone: '01755-889900',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      vehicle: 'Hero Splendor Plus (Red)',
      vehiclePlate: 'Gaibandha-Ha-11-2345',
      rating: 4.9,
      completedDeliveries: 1420,
      currentLocationName: 'College Road Hub, Gaibandha',
      distanceKm: 1.8,
      etaMinutes: 18,
      speedKmH: 32,
      lat: 25.3292,
      lng: 89.5416
    }
  };
}
