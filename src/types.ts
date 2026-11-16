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

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
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

export interface StoreInfo {
  name: string;
  tagline: string;
  address: string;
  division: string;
  postCode: string;
  hotline: string;
  emergencyHelp: string;
  email: string;
  deliveryLocations: string[];
  features: string[];
}
