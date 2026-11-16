import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  bengaliName: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  badge?: string;
  rating: number;
  reviewsCount: number;
  soldCount: number;
  stock: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  brand: string;
  isCyclone?: boolean;
  isExpress?: boolean;
  seller: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'customer' | 'admin';
  address: string;
  city: string;
  division: string;
  zipCode: string;
  balance: number;
  points: number;
  createdAt: string;
  wishlist: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface RiderInfo {
  id: string;
  name: string;
  bengaliName: string;
  phone: string;
  photo: string;
  vehicle: string;
  vehiclePlate: string;
  rating: number;
  completedDeliveries: number;
  currentLocationName: string;
  distanceKm: number;
  etaMinutes: number;
  speedKmH: number;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Cash on Delivery';
  orderStatus: 'Confirmed' | 'Processing' | 'Hub Received (Gaibandha)' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
  invoiceNumber?: string;
  rider?: RiderInfo;
  notes?: string;
  pointsEarned?: number;
  pointsUsed?: number;
  pointsDiscount?: number;
}

export interface Voucher {
  code: string;
  discountType: 'fixed' | 'percent';
  value: number;
  minOrder: number;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
  helpfulCount: number;
  location?: string;
}

export interface DatabaseSchema {
  products: Product[];
  users: User[];
  orders: Order[];
  vouchers: Voucher[];
  categories: { id: string; name: string; slug: string; icon: string; count: number; image: string }[];
  reviews: Review[];
}

const DB_FILE = path.resolve(process.cwd(), 'data', 'db.json');

const INITIAL_CATEGORIES = [
  { id: '1', name: 'Smartphones & Gadgets', slug: 'smartphones-gadgets', icon: 'Smartphone', count: 18, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Fashion & Lifestyle', slug: 'fashion-lifestyle', icon: 'Shirt', count: 24, image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Home Appliances', slug: 'home-appliances', icon: 'Tv', count: 14, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Groceries & Daily Express', slug: 'groceries-daily', icon: 'ShoppingBag', count: 32, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80' },
  { id: '5', name: 'Bikes & Motor Vehicles', slug: 'bikes-vehicles', icon: 'Bike', count: 8, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&auto=format&fit=crop&q=80' },
  { id: '6', name: 'Health & Beauty Care', slug: 'health-beauty', icon: 'Sparkles', count: 19, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80' }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kp-101',
    name: 'Samsung Galaxy S24 Ultra (12GB/256GB Titanium)',
    bengaliName: 'স্যামসাং গ্যালাক্সি এস২৪ আল্ট্রা',
    category: 'Smartphones & Gadgets',
    categorySlug: 'smartphones-gadgets',
    price: 139999,
    originalPrice: 175000,
    discountPercent: 20,
    badge: 'Cyclone Deal ⚡',
    rating: 4.9,
    reviewsCount: 148,
    soldCount: 84,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The ultimate flagship smartphone with Galaxy AI capabilities, 200MP camera with Quad Telephoto, Snapdragon 8 Gen 3 processor, and built-in S-Pen. 1 Year Official Brand Warranty across Bangladesh.',
    features: ['Snapdragon 8 Gen 3 for Galaxy', '200MP Quad Camera with AI Zoom', '5000mAh Battery with 45W Fast Charging', 'Titanium Armor Frame with IP68'],
    brand: 'Samsung',
    isCyclone: true,
    isExpress: true,
    seller: 'Samsung Bangladesh Authorized Flagship'
  },
  {
    id: 'kp-102',
    name: 'Apple iPhone 15 Pro Max (256GB Natural Titanium)',
    bengaliName: 'অ্যাপল আইফোন ১৫ প্রো ম্যাক্স',
    category: 'Smartphones & Gadgets',
    categorySlug: 'smartphones-gadgets',
    price: 154900,
    originalPrice: 189999,
    discountPercent: 18,
    badge: 'Mega Deal 🔥',
    rating: 5.0,
    reviewsCount: 210,
    soldCount: 92,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever with 5x telephoto optical zoom.',
    features: ['A17 Pro chip with 6-core GPU', '48MP Main Camera + 5x Telephoto', 'Super Retina XDR OLED ProMotion 120Hz', 'USB-C with USB 3 speeds'],
    brand: 'Apple',
    isCyclone: true,
    isExpress: true,
    seller: 'Apple Gadget World Gaibandha Hub'
  },
  {
    id: 'kp-103',
    name: 'Yamaha R15 V4 Racing Blue (155cc Dual ABS BS6)',
    bengaliName: 'ইয়ামাহা আর১৫ ভি৪ রেসিং ব্লু',
    category: 'Bikes & Motor Vehicles',
    categorySlug: 'bikes-vehicles',
    price: 495000,
    originalPrice: 565000,
    discountPercent: 12,
    badge: 'Cyclone Super Deal ⚡',
    rating: 4.9,
    reviewsCount: 64,
    soldCount: 22,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Iconic supersport motorcycle with Traction Control System, Quick Shifter, Upside Down Front Forks, Y-Connect Bluetooth Connectivity, and high performance 155cc LC4V VVA Engine. Direct registration delivery at Gaibandha BRTA!',
    features: ['155cc Liquid Cooled 4-Stroke SOHC 4-Valve Engine', 'Variable Valve Actuation (VVA)', 'Assist & Slipper Clutch with Quick Shifter', 'Dual Channel ABS & Traction Control'],
    brand: 'Yamaha',
    isCyclone: true,
    isExpress: false,
    seller: 'ACI Motors Authorized Gaibandha Showroom'
  },
  {
    id: 'kp-104',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    bengaliName: 'সনি নয়েজ ক্যান্সেলিং হেডফোন',
    category: 'Smartphones & Gadgets',
    categorySlug: 'smartphones-gadgets',
    price: 34990,
    originalPrice: 42000,
    discountPercent: 17,
    badge: 'Express Gaibandha 🚀',
    rating: 4.8,
    reviewsCount: 89,
    soldCount: 45,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Industry-leading noise cancellation optimized with two processors and 8 microphones. Magnificent sound quality engineered to perfection with 30-hour battery life and ultra-comfortable design.',
    features: ['Auto NC Optimizer based on wearing conditions', '30-Hour Battery with 3 min quick charge', 'Speak-to-Chat & Multipoint Connection', 'High-Resolution Audio Wireless LDAC'],
    brand: 'Sony',
    isCyclone: false,
    isExpress: true,
    seller: 'Kapaly Official Store'
  },
  {
    id: 'kp-105',
    name: 'Walton Inverter Smart Frost-Free Refrigerator 380L',
    bengaliName: 'ওয়ালটন ইনভার্টার রেফ্রিজারেটর ৩৮০ লিটার',
    category: 'Home Appliances',
    categorySlug: 'home-appliances',
    price: 48900,
    originalPrice: 58000,
    discountPercent: 16,
    badge: 'Cyclone Deal ⚡',
    rating: 4.7,
    reviewsCount: 112,
    soldCount: 56,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Intelligent Inverter technology saves up to 70% electricity. Nano healthcare technology keeps food 100% fresh, hygienic and bacterial free. 12 Years compressor warranty with home delivery at College Road, Gaibandha.',
    features: ['Intelligent Inverter Compressor', 'Wide Voltage Design (140V-260V)', 'DEO Fresh Technology', 'Door Open Alarm & LED Display'],
    brand: 'Walton',
    isCyclone: true,
    isExpress: true,
    seller: 'Walton Plaza Gaibandha College Road'
  },
  {
    id: 'kp-106',
    name: 'Premium Semi-Formal Embroidered Cotton Panjabi (Deep Navy)',
    bengaliName: 'প্রিমিয়াম সেমি-ফরমাল কারুকাজ পাঞ্জাবি',
    category: 'Fashion & Lifestyle',
    categorySlug: 'fashion-lifestyle',
    price: 2450,
    originalPrice: 4200,
    discountPercent: 42,
    badge: '42% OFF 💥',
    rating: 4.9,
    reviewsCount: 230,
    soldCount: 380,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Crafted from 100% Egyptian combed cotton with intricate neckline metallic thread embroidery and signature metallic snap buttons. Breathable fabric ideal for celebrations, Jummah and festive gatherings.',
    features: ['100% Premium Combed Cotton', 'Designer collar & placket embroidery', 'Regular comfortable tailored fit', 'Colorfast and pre-shrunk fabric'],
    brand: 'KAPALY Signature',
    isCyclone: true,
    isExpress: true,
    seller: 'Kapaly Lifestyle Fashion House'
  },
  {
    id: 'kp-107',
    name: 'Traditional Dhakai Jamdani Handloom Saree (Crimson Red & Gold)',
    bengaliName: 'ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি',
    category: 'Fashion & Lifestyle',
    categorySlug: 'fashion-lifestyle',
    price: 6850,
    originalPrice: 11500,
    discountPercent: 40,
    badge: 'Best Seller 🌟',
    rating: 4.9,
    reviewsCount: 165,
    soldCount: 210,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Exquisite authentic handloom Dhakai Jamdani saree with fine zari motifs. Lightweight, elegant drape and rich heritage artisan craftsmanship from Narayanganj weavers.',
    features: ['Pure Resham Cotton & Zari Work', 'Rich floral and geometric motif', 'Matching unstitched blouse piece included', '12 Hand length with rich pallu'],
    brand: 'Dhakai Heritage',
    isCyclone: false,
    isExpress: true,
    seller: 'Gaibandha Handloom Craft'
  },
  {
    id: 'kp-108',
    name: 'Teer Fortified Soybean Oil (5 Litre Canister)',
    bengaliName: 'তীর ফর্টিফাইড সয়াবিন তেল ৫ লিটার',
    category: 'Groceries & Daily Express',
    categorySlug: 'groceries-daily',
    price: 810,
    originalPrice: 910,
    discountPercent: 11,
    badge: 'Express Daily ⚡',
    rating: 4.8,
    reviewsCount: 420,
    soldCount: 940,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'City Group Teer Fortified Soybean Oil enriched with Vitamin A & D. Pure, hygienic and tested in world-class laboratories. Delivered in 2 hours within Gaibandha Sadar!',
    features: ['Enriched with Vitamin A & Vitamin D', 'Cholesterol free heart healthy oil', '100% pure triple refined', 'Tamper-proof safety sealed can'],
    brand: 'Teer',
    isCyclone: false,
    isExpress: true,
    seller: 'Kapaly Express Daily Gaibandha'
  },
  {
    id: 'kp-109',
    name: 'Miniket Premium Aromatic Rice 25kg Sack (Dinajpur Special)',
    bengaliName: 'দিনাজপুরের মিনিকেট চাল ২৫ কেজি',
    category: 'Groceries & Daily Express',
    categorySlug: 'groceries-daily',
    price: 1850,
    originalPrice: 2150,
    discountPercent: 14,
    badge: 'Cyclone Daily ⚡',
    rating: 4.9,
    reviewsCount: 310,
    soldCount: 520,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Selected fine, non-sticky long grain Miniket rice sourced from Dinajpur paddy fields. Double sorted, stone free and carefully packaged for pure homestyle feasts.',
    features: ['Long grain, lustrous white rice', 'Zero dust, stones or chaff', 'Naturally aged for optimum fluffy cooking', 'Direct from North Bengal farms'],
    brand: 'Chashi',
    isCyclone: true,
    isExpress: true,
    seller: 'Kapaly Express Daily Gaibandha'
  },
  {
    id: 'kp-110',
    name: 'Xiaomi Smart TV A Pro 43" 4K UHD Dolby Audio Android',
    bengaliName: 'শাওমি ৪৩ ইঞ্চি ৪কে স্মার্ট টিভি',
    category: 'Home Appliances',
    categorySlug: 'home-appliances',
    price: 36999,
    originalPrice: 45000,
    discountPercent: 18,
    badge: 'Cyclone Deal ⚡',
    rating: 4.8,
    reviewsCount: 95,
    soldCount: 68,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Bezel-less metallic frame design, 4K Ultra HD display with Dolby Vision, immersive 24W stereo speakers with Dolby Audio & DTS:X, Google TV OS with voice assistant remote.',
    features: ['4K UHD 3840x2160 Resolution', 'Google TV with Chromecast Built-in', 'Dolby Vision & HDR10 Support', 'Quad-Core Processor with 2GB RAM + 16GB ROM'],
    brand: 'Xiaomi',
    isCyclone: true,
    isExpress: true,
    seller: 'Xiaomi Authorized Gaibandha Store'
  },
  {
    id: 'kp-111',
    name: 'CeraVe Foaming Facial Cleanser & Moisturizing Cream Set',
    bengaliName: 'সেরাভে ফোমিং ফেসিয়াল ক্লিনজার ও ক্রিম সেট',
    category: 'Health & Beauty Care',
    categorySlug: 'health-beauty',
    price: 2950,
    originalPrice: 3800,
    discountPercent: 22,
    badge: '100% Authentic ✨',
    rating: 4.9,
    reviewsCount: 178,
    soldCount: 260,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Dermatologist recommended skincare set formulated with 3 essential ceramides, hyaluronic acid, and niacinamide to restore protective skin barrier without stripping natural moisture.',
    features: ['Non-comedogenic & fragrance free', 'Contains 3 essential ceramides (1, 3, 6-II)', 'Gentle on sensitive & acne-prone skin', 'Direct import from USA with authenticity QR tag'],
    brand: 'CeraVe',
    isCyclone: false,
    isExpress: true,
    seller: 'Kapaly Beauty Lounge'
  },
  {
    id: 'kp-112',
    name: 'Bajaj Pulsar NS160 Dual Channel ABS (Fi Engine)',
    bengaliName: 'বাজাজ পালসার এনএস১৬০ ডুয়েল এবিএস',
    category: 'Bikes & Motor Vehicles',
    categorySlug: 'bikes-vehicles',
    price: 218500,
    originalPrice: 245000,
    discountPercent: 11,
    badge: 'Cyclone Super Deal ⚡',
    rating: 4.8,
    reviewsCount: 78,
    soldCount: 31,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Naked sports styling meets cutting-edge fuel injection technology with Perimeter Frame for superior agility and stability, upside down forks and dual-channel ABS braking.',
    features: ['160.3cc Oil Cooled Twin Spark DTS-i FI Engine', '17.2 PS Power @ 9000 RPM', 'Dual Channel ABS with 300mm front disc', 'Inverted Front Fork suspension'],
    brand: 'Bajaj',
    isCyclone: true,
    isExpress: false,
    seller: 'Uttara Motors Gaibandha Agency'
  }
];

export const DEFAULT_RIDER: RiderInfo = {
  id: 'rdr-gb-01',
  name: 'Md. Karim Mia',
  bengaliName: 'মোঃ করিম মিয়া',
  phone: '+880 1719-876543',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  vehicle: 'Hero Splendor Plus 100cc',
  vehiclePlate: 'Gaibandha-Ha-11-2345',
  rating: 4.9,
  completedDeliveries: 342,
  currentLocationName: 'Near Gaibandha Govt. College, College Road',
  distanceKm: 1.2,
  etaMinutes: 14,
  speedKmH: 32,
  lat: 25.3284,
  lng: 89.5407
};

const INITIAL_VOUCHERS: Voucher[] = [
  { code: 'FOKIR100', discountType: 'fixed', value: 100, minOrder: 1000, description: '৳100 flat discount on orders over ৳1,000' },
  { code: 'CYCLONE50', discountType: 'percent', value: 15, minOrder: 3000, description: '15% instant discount up to ৳800 on Cyclone deals' },
  { code: 'GAIBANDHA', discountType: 'fixed', value: 60, minOrder: 500, description: 'Free Express delivery in Gaibandha (৳60 off)' }
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Fokirer Bajar Admin',
    phone: '01900000000',
    email: 'admin@fokirerbajar.com.bd',
    role: 'admin',
    address: 'Central Management Office, College Road',
    city: 'Gaibandha Sadar',
    division: 'Rangpur',
    zipCode: '5700',
    balance: 50000,
    points: 9999,
    createdAt: '2025-01-01T10:00:00.000Z',
    wishlist: []
  },
  {
    id: 'usr_gaibandha_01',
    name: 'Shabbir Mahamud',
    phone: '01712345678',
    email: 'shabbirmahamudcontact@gmail.com',
    role: 'customer',
    address: 'Holding #42, College Road, Near Govt. Boys High School',
    city: 'Gaibandha Sadar',
    division: 'Rangpur',
    zipCode: '5700',
    balance: 2450,
    points: 850,
    createdAt: '2025-01-15T10:00:00.000Z',
    wishlist: ['kp-101', 'kp-103', 'kp-106']
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'FB-982411',
    userId: 'usr_gaibandha_01',
    customerName: 'Shabbir Mahamud',
    phone: '01712345678',
    shippingAddress: 'Holding #42, College Road, Near Govt. Boys High School',
    city: 'Gaibandha Sadar',
    items: [
      {
        productId: 'kp-106',
        name: 'Premium Semi-Formal Embroidered Cotton Panjabi (Deep Navy)',
        price: 2450,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&auto=format&fit=crop&q=80'
      },
      {
        productId: 'kp-108',
        name: 'Teer Fortified Soybean Oil (5 Litre Canister)',
        price: 810,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 4070,
    deliveryFee: 0,
    discount: 100,
    total: 3970,
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    createdAt: '2026-11-09T14:22:00.000Z',
    estimatedDelivery: 'Today, within 20 mins',
    trackingNumber: 'TRK-FB-884210',
    invoiceNumber: 'INV-FB-982411',
    rider: DEFAULT_RIDER,
    notes: 'Please call before arriving at College Road.',
    pointsEarned: 198,
    pointsUsed: 0,
    pointsDiscount: 0
  }
];

const INITIAL_REVIEWS: Review[] = [
  // kp-101 (Samsung Galaxy S24 Ultra)
  {
    id: 'rev-101-1',
    productId: 'kp-101',
    userName: 'Shabbir Mahamud',
    rating: 5,
    title: 'অসাধারণ ডেলিভারি ও অরিজিনাল ফোন!',
    comment: 'কলেজ রোড হাবে অর্ডার করার মাত্র ২ ঘণ্টার মধ্যেই রাইডার করিম ভাই পৌঁছে দিয়েছেন। প্যাকেজিং নিখুঁত ও ইন্ট্যাক্ট সিল ছিলো। গ্যালাক্সি এআই ও ২০০ মেগাপিক্সেল ক্যামেরা এক কথায় অবিশ্বাস্য।',
    createdAt: '2026-11-08T11:30:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 24,
    location: 'College Road, Gaibandha'
  },
  {
    id: 'rev-101-2',
    productId: 'kp-101',
    userName: 'Engr. Tanvir Ahmed',
    rating: 5,
    title: 'Top-tier flagship with official warranty',
    comment: 'Titanium gray finish is gorgeous. S-Pen latency is imperceptible. Received genuine warranty card and official invoice. Highly recommended for power users!',
    createdAt: '2026-11-05T16:15:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 15,
    location: 'Gaibandha Sadar'
  },
  {
    id: 'rev-101-3',
    productId: 'kp-101',
    userName: 'Mahmudur Rahman',
    rating: 4,
    title: 'Great phone, heavy battery backup',
    comment: 'Display brightness in daylight is supreme. Battery easily lasts 1.5 days on heavy 5G usage. Slightly pricey, but with Cyclone discount ৳139,999 is good value.',
    createdAt: '2026-10-28T09:40:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 9,
    location: 'Palashbari, Gaibandha'
  },
  // kp-102 (iPhone 15 Pro Max)
  {
    id: 'rev-102-1',
    productId: 'kp-102',
    userName: 'Dr. Kamrul Hasan',
    rating: 5,
    title: '100% Authentic Natural Titanium',
    comment: 'Checked serial number on Apple coverage page, completely fresh and active warranty. 5x optical zoom camera is mind-blowing. Thank you Fokirer Bajar!',
    createdAt: '2026-11-07T14:20:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 31,
    location: 'Govt. Hospital Zone, Gaibandha'
  },
  {
    id: 'rev-102-2',
    productId: 'kp-102',
    userName: 'Farhana Akter Ritu',
    rating: 5,
    title: 'সেরা অভিজ্ঞতা!',
    comment: 'বিকাশ ওটিপিতে খুব সহজেই পেমেন্ট করলাম। কোনো ঝামেলা ছাড়াই দ্রুত হাতে পেয়েছি। ফোনের ওজন আগের ১৪ প্রো ম্যাক্সের চেয়ে অনেক হালকা।',
    createdAt: '2026-10-30T18:05:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 12,
    location: 'College Road Area'
  },
  // kp-103 (Yamaha R15 V4)
  {
    id: 'rev-103-1',
    productId: 'kp-103',
    userName: 'Mehedi Hasan Babu',
    rating: 5,
    title: 'স্বপ্নের বাইক এখন গাইবান্ধায়!',
    comment: 'ACI Motors অফিসিয়াল শোরুম থেকে সরাসরি কাগজপত্র সহ ডেলিভারি পেয়েছি। কুইক শিফটার এবং ট্র্যাকশন কন্ট্রোল থাকায় রাইডিং এক্সপেরিয়েন্স দুর্দান্ত।',
    createdAt: '2026-11-06T10:00:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 42,
    location: 'Gaibandha Sadar'
  },
  {
    id: 'rev-103-2',
    productId: 'kp-103',
    userName: 'Rashedul Islam',
    rating: 5,
    title: 'Smooth delivery & proper documentation',
    comment: 'Got BRTA registration guidance from team. Bike condition was pristine 0 km odometer. Dual ABS provides confident braking on highways.',
    createdAt: '2026-10-25T12:00:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 18,
    location: 'Gobindaganj'
  },
  // kp-104 (Sony WH-1000XM5)
  {
    id: 'rev-104-1',
    productId: 'kp-104',
    userName: 'Saiful Islam',
    rating: 5,
    title: 'Best Noise Cancellation Ever',
    comment: 'Working from home or traveling to Dhaka by train, the silence this headphone provides is pure bliss. LDAC sound with Apple Music is pristine.',
    createdAt: '2026-11-04T08:30:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 16,
    location: 'College Road'
  },
  {
    id: 'rev-104-2',
    productId: 'kp-104',
    userName: 'Naimur Rahman',
    rating: 4,
    title: 'Super comfort and battery life',
    comment: 'Extremely lightweight, does not press the ears even after 6 hours of continuous zoom calls. Fast charging gives 3 hours in 3 minutes.',
    createdAt: '2026-10-22T15:20:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 8,
    location: 'Sundarganj'
  },
  // kp-105 (Walton Inverter Fridge)
  {
    id: 'rev-105-1',
    productId: 'kp-105',
    userName: 'Abdul Alim',
    rating: 5,
    title: 'বিদ্যুৎ সাশ্রয়ী ও পর্যাপ্ত জায়গা',
    comment: '৩৮০ লিটার ক্যাপাসিটিতে ডিপ এবং নরমাল দুটোতেই প্রচুর জায়গা। ইনভার্টার কম্প্রেসরে বিদ্যুৎ বিল খুবই কম আসে। ১২ বছরের অফিসিয়াল ওয়ারেন্টি কার্ড সহ পেয়েছি।',
    createdAt: '2026-11-03T11:00:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 22,
    location: 'College Road, Gaibandha'
  },
  // kp-106 (Embroidered Panjabi)
  {
    id: 'rev-106-1',
    productId: 'kp-106',
    userName: 'Jamil Hossain',
    rating: 5,
    title: 'কাপড়ের কোয়ালিটি ও কাজ প্রিমিয়াম',
    comment: '১০০% পিওর কটন ফেব্রিক, কোনো ভাঁজ পড়ে না। গলার সুতার এমব্রয়ডারি খুবই পরিপাটি। সাইজ চার্ট একদম নিখুঁত।',
    createdAt: '2026-11-08T17:40:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 19,
    location: 'Gaibandha Sadar'
  },
  {
    id: 'rev-106-2',
    productId: 'kp-106',
    userName: 'Sabbir Ahmed',
    rating: 5,
    title: 'Value for money in Cyclone sale',
    comment: 'Got it at 42% discount during cyclone flash sale. Looks way more expensive than ৳2,450. Will order more colors.',
    createdAt: '2026-11-01T13:10:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 11,
    location: 'Govt College Gate'
  },
  // kp-107 (Jamdani Saree)
  {
    id: 'rev-107-1',
    productId: 'kp-107',
    userName: 'Nusrat Jahan',
    rating: 5,
    title: 'ঐতিহ্যবাহী ঢাকাই জামদানির নিখুঁত রূপ',
    comment: 'শাড়ির বুনন ও জরির কাজ চোখ জুড়ানো। অনুষ্ঠানে পরার পর সবাই প্রশংসা করেছে। ম্যাচিং ব্লাউজ পিস সাথে পেয়েছি।',
    createdAt: '2026-11-04T19:30:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 27,
    location: 'Gaibandha Sadar'
  },
  // kp-108 (Teer Soybean Oil)
  {
    id: 'rev-108-1',
    productId: 'kp-108',
    userName: 'Sultana Begum',
    rating: 5,
    title: 'মাত্র দেড় ঘণ্টায় ডেলিভারি!',
    comment: 'গাইবান্ধা সদরের মধ্যে এত দ্রুত বাজার পাওয়া যাবে ভাবিনি। তেলের ক্যান সিলগালা করা ছিলো এবং দাম বাজারের চেয়েও কম।',
    createdAt: '2026-11-09T09:15:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 35,
    location: 'College Road, Gaibandha'
  },
  // kp-109 (Miniket Rice)
  {
    id: 'rev-109-1',
    productId: 'kp-109',
    userName: 'Haji Mohammad Younus',
    rating: 5,
    title: 'দিনাজপুরের খাঁটি চিকন মিনিকেট',
    comment: 'চাল একদম চকচকে সাদা, ভাত রান্না করলে লম্বা ও ঝরঝরে হয়। বস্তা পরিষ্কার ছিল এবং রাইডার সরাসরি রান্নাঘর পর্যন্ত এনে দিয়েছে।',
    createdAt: '2026-11-07T12:00:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 17,
    location: 'Saghata, Gaibandha'
  },
  // kp-110 (Xiaomi Smart TV)
  {
    id: 'rev-110-1',
    productId: 'kp-110',
    userName: 'Arifuzzaman',
    rating: 5,
    title: 'Crisp 4K and vibrant Dolby audio',
    comment: 'Chromecast and Google TV work flawlessly with Netflix and YouTube. Wall mount bracket included. Great service from College road team.',
    createdAt: '2026-11-02T16:00:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 14,
    location: 'Gaibandha Sadar'
  },
  // kp-111 (CeraVe Cleanser)
  {
    id: 'rev-111-1',
    productId: 'kp-111',
    userName: 'Sadia Afrin',
    rating: 5,
    title: '100% Authentic with Verification Barcode',
    comment: 'Scanned the QR tag on packaging and confirmed original batch. Foaming texture is gentle on acne-prone skin.',
    createdAt: '2026-11-06T14:40:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 20,
    location: 'College Road'
  },
  // kp-112 (Bajaj Pulsar NS160)
  {
    id: 'rev-112-1',
    productId: 'kp-112',
    userName: 'Kawsar Mahmud',
    rating: 5,
    title: 'Pulsar NS160 Fi is a beast',
    comment: 'Oil-cooled engine pickup is aggressive and dual-channel ABS guarantees emergency stop safety. Received registration documents smoothly.',
    createdAt: '2026-10-29T11:20:00.000Z',
    verifiedPurchase: true,
    helpfulCount: 25,
    location: 'Gaibandha Sadar'
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.reviews || !Array.isArray(parsed.reviews) || parsed.reviews.length === 0) {
          parsed.reviews = INITIAL_REVIEWS;
        }
        // Ensure each product's rating and reviewsCount match the reviews
        for (const prod of parsed.products) {
          const revs = parsed.reviews.filter((r: any) => r.productId === prod.id);
          if (revs.length > 0) {
            const sum = revs.reduce((acc: number, r: any) => acc + Number(r.rating || 5), 0);
            prod.rating = Number((sum / revs.length).toFixed(1));
            prod.reviewsCount = revs.length;
          }
        }
        this.save(parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed reading db.json, generating fresh state:', e);
    }

    const initial: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      users: INITIAL_USERS,
      orders: INITIAL_ORDERS,
      vouchers: INITIAL_VOUCHERS,
      categories: INITIAL_CATEGORIES,
      reviews: INITIAL_REVIEWS
    };
    this.save(initial);
    return initial;
  }

  private save(dataToSave: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed writing db.json:', e);
    }
  }

  public getProducts(filter?: { category?: string; search?: string; cycloneOnly?: boolean; sort?: string }): Product[] {
    let list = [...this.data.products];

    if (filter?.category && filter.category !== 'all') {
      const cat = filter.category.toLowerCase();
      list = list.filter(p => p.categorySlug.toLowerCase() === cat || p.category.toLowerCase() === cat);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.bengaliName.includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filter?.cycloneOnly) {
      list = list.filter(p => p.isCyclone);
    }

    if (filter?.sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (filter?.sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (filter?.sort === 'popular') {
      list.sort((a, b) => b.soldCount - a.soldCount);
    } else if (filter?.sort === 'discount') {
      list.sort((a, b) => b.discountPercent - a.discountPercent);
    }

    return list;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public getCategories() {
    return this.data.categories;
  }

  public getUserByEmailOrPhone(identifier: string): User | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.data.users.find(u => u.email.toLowerCase() === clean || u.phone === clean);
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getAdminUser(): User {
    let admin = this.data.users.find(u => u.role === 'admin');
    if (!admin) {
      admin = {
        id: 'usr_admin_01',
        name: 'Fokirer Bajar Admin',
        phone: '01900000000',
        email: 'admin@fokirerbajar.com.bd',
        role: 'admin',
        address: 'Central Management Office, College Road',
        city: 'Gaibandha Sadar',
        division: 'Rangpur',
        zipCode: '5700',
        balance: 50000,
        points: 9999,
        createdAt: '2025-01-01T10:00:00.000Z',
        wishlist: []
      };
      this.data.users.push(admin);
      this.save(this.data);
    }
    return admin;
  }

  public verifyAdminPasscode(passcode: string): boolean {
    const validCodes = ['admin2026', 'fokir2026', 'fokiradmin', 'gaibandha2026'];
    return validCodes.includes(passcode.trim().toLowerCase());
  }

  public createUser(user: Omit<User, 'id' | 'createdAt' | 'balance' | 'points' | 'wishlist'>): User {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}`,
      balance: 100, // Sign-up bonus ৳100 in Kapaly wallet!
      points: 50,
      createdAt: new Date().toISOString(),
      wishlist: []
    };
    this.data.users.push(newUser);
    this.save(this.data);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save(this.data);
    return this.data.users[idx];
  }

  public toggleWishlist(userId: string, productId: string): string[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    if (!user.wishlist) user.wishlist = [];

    if (user.wishlist.includes(productId)) {
      user.wishlist = user.wishlist.filter(id => id !== productId);
    } else {
      user.wishlist.push(productId);
    }
    this.save(this.data);
    return user.wishlist;
  }

  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [...this.data.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.trackingNumber === id);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber' | 'estimatedDelivery' | 'orderStatus'>): { order: Order; updatedUser?: User } {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const pointsUsed = Number(orderData.pointsUsed) || 0;
    const pointsDiscount = Number(orderData.pointsDiscount) || 0;
    // Calculate loyalty points earned: 1 point per ৳20 spent on total (minimum 5 points)
    const pointsEarned = Math.max(5, Math.floor(orderData.total / 20));

    const newOrder: Order = {
      ...orderData,
      id: `FB-${randomSuffix}`,
      trackingNumber: `TRK-FB-${randomSuffix}`,
      invoiceNumber: `INV-FB-${randomSuffix}`,
      orderStatus: 'Out for Delivery',
      createdAt: new Date().toISOString(),
      estimatedDelivery: 'Within 25-45 Minutes (Gaibandha Sadar Rider)',
      pointsEarned,
      pointsUsed,
      pointsDiscount,
      rider: {
        ...DEFAULT_RIDER,
        distanceKm: Number((0.8 + Math.random() * 1.5).toFixed(1)),
        etaMinutes: Math.floor(12 + Math.random() * 18),
        speedKmH: Math.floor(28 + Math.random() * 10)
      }
    };

    // Decrease stock and increment sold count
    for (const item of newOrder.items) {
      const prod = this.data.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        prod.soldCount += item.quantity;
      }
    }

    // Award loyalty points to user and deduct redeemed points
    let updatedUser: User | undefined;
    if (newOrder.userId && newOrder.userId !== 'guest' && newOrder.userId !== 'guest_user') {
      const u = this.data.users.find(user => user.id === newOrder.userId);
      if (u) {
        const currentPoints = u.points || 0;
        u.points = Math.max(0, currentPoints - pointsUsed) + pointsEarned;
        updatedUser = u;
      }
    }

    this.data.orders.unshift(newOrder);
    this.save(this.data);
    return { order: newOrder, updatedUser };
  }

  public checkVoucher(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
    const v = this.data.vouchers.find(item => item.code.toUpperCase() === code.trim().toUpperCase());
    if (!v) {
      return { valid: false, discount: 0, message: 'Invalid promo voucher code' };
    }
    if (subtotal < v.minOrder) {
      return { valid: false, discount: 0, message: `Minimum order ৳${v.minOrder} required for ${v.code}` };
    }
    let discount = 0;
    if (v.discountType === 'fixed') {
      discount = v.value;
    } else {
      discount = Math.round((subtotal * v.value) / 100);
      if (discount > 800) discount = 800; // Cap
    }
    return { valid: true, discount, message: `Applied voucher ${v.code}: ৳${discount} saved!` };
  }
  public updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | null {
    const order = this.data.orders.find(o => o.id === orderId || o.trackingNumber === orderId);
    if (!order) return null;
    order.orderStatus = status;
    this.save(this.data);
    return order;
  }

  public addProduct(productData: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...productData,
      id: `fb-${Date.now()}`
    };
    this.data.products.unshift(newProduct);
    this.save(this.data);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save(this.data);
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save(this.data);
      return true;
    }
    return false;
  }

  public getAllUsers(): User[] {
    return this.data.users;
  }

  public getAdminStats() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
    const totalProducts = this.data.products.length;
    const totalUsers = this.data.users.length;
    const outForDelivery = this.data.orders.filter(o => o.orderStatus === 'Out for Delivery').length;
    const pendingOrders = this.data.orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing').length;
    const deliveredOrders = this.data.orders.filter(o => o.orderStatus === 'Delivered').length;

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      outForDelivery,
      pendingOrders,
      deliveredOrders
    };
  }

  public getReviews(productId: string): Review[] {
    if (!this.data.reviews) this.data.reviews = [];
    return this.data.reviews
      .filter(r => r.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getReviewStats(productId: string) {
    const reviews = this.getReviews(productId);
    const prod = this.data.products.find(p => p.id === productId);

    const distribution: { 5: number; 4: number; 3: number; 2: number; 1: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    reviews.forEach(r => {
      const star = (Math.max(1, Math.min(5, Math.round(r.rating)))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] = (distribution[star] || 0) + 1;
      sum += star;
    });

    const reviewsCount = reviews.length;
    const rating = reviewsCount > 0 ? Number((sum / reviewsCount).toFixed(1)) : (prod?.rating || 5.0);

    return {
      rating,
      reviewsCount,
      distribution
    };
  }

  public addReview(reviewData: {
    productId: string;
    userId?: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title?: string;
    comment: string;
    location?: string;
    verifiedPurchase?: boolean;
  }): { review: Review; product: Product; stats: { rating: number; reviewsCount: number; distribution: { 5: number; 4: number; 3: number; 2: number; 1: number } } } | null {
    const prod = this.data.products.find(p => p.id === reviewData.productId);
    if (!prod) return null;

    if (!this.data.reviews) this.data.reviews = [];

    const safeRating = Math.max(1, Math.min(5, Math.round(Number(reviewData.rating) || 5)));
    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: reviewData.productId,
      userId: reviewData.userId,
      userName: reviewData.userName.trim() || 'Valued Customer',
      userAvatar: reviewData.userAvatar,
      rating: safeRating,
      title: reviewData.title?.trim() || '',
      comment: reviewData.comment.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: reviewData.verifiedPurchase ?? true,
      helpfulCount: 0,
      location: reviewData.location?.trim() || 'College Road, Gaibandha'
    };

    this.data.reviews.unshift(newReview);

    // Recalculate average rating & reviewsCount for this product
    const stats = this.getReviewStats(reviewData.productId);
    prod.rating = stats.rating;
    prod.reviewsCount = stats.reviewsCount;

    this.save(this.data);
    return { review: newReview, product: prod, stats };
  }

  public voteReviewHelpful(reviewId: string): Review | null {
    if (!this.data.reviews) return null;
    const rev = this.data.reviews.find(r => r.id === reviewId);
    if (!rev) return null;
    rev.helpfulCount = (rev.helpfulCount || 0) + 1;
    this.save(this.data);
    return rev;
  }
}

export const db = new Database();
