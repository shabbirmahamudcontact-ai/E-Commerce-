import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, User, CartItem, Order, Category, StoreInfo, Review } from '../types.ts';
import {
  apiFetch,
  createLocalDemoOrder,
  getStoredJson,
  loadStaticFallbackDb,
  setStoredJson,
  STATIC_ADMIN_USER,
  STATIC_STORE_INFO
} from '../lib/api.ts';

interface NotificationToast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  categories: Category[];
  products: Product[];
  storeInfo: StoreInfo | null;
  loading: boolean;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Auth Actions
  login: (identifier: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; phone: string; email?: string; address?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  // Orders
  refreshOrders: () => Promise<void>;
  placeOrder: (orderPayload: any) => Promise<{ success: boolean; order?: Order; error?: string }>;
  // UI Dialog States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isUserPanelOpen: boolean;
  setIsUserPanelOpen: (open: boolean) => void;
  userPanelTab: 'orders' | 'profile' | 'wishlist' | 'wallet' | 'points';
  setUserPanelTab: (tab: 'orders' | 'profile' | 'wishlist' | 'wallet' | 'points') => void;
  activeInfoPage: 'replacement' | 'payment' | 'terms' | 'privacy' | null;
  setActiveInfoPage: (page: 'replacement' | 'payment' | 'terms' | 'privacy' | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  selectedOrderTracking: Order | null;
  setSelectedOrderTracking: (ord: Order | null) => void;
  // Invoice & Rider Tracking Modals
  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  activeInvoiceOrder: Order | null;
  openInvoice: (order: Order) => void;
  isRiderModalOpen: boolean;
  setIsRiderModalOpen: (open: boolean) => void;
  activeRiderOrder: Order | null;
  openRiderTracking: (order: Order) => void;
  // AI Assistant Modal
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  // Admin Panel
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminLogin: (passcode: string) => Promise<{ success: boolean; message?: string }>;
  exitAdminMode: () => void;
  updateOrderStatusAdmin: (orderId: string, status: Order['orderStatus']) => Promise<boolean>;
  addProductAdmin: (productData: any) => Promise<boolean>;
  updateProductAdmin: (id: string, updates: any) => Promise<boolean>;
  deleteProductAdmin: (id: string) => Promise<boolean>;
  reloadProducts: () => Promise<void>;
  // Reviews & Ratings
  submitReview: (productId: string, reviewData: { rating: number; comment: string; title?: string; userName?: string; location?: string }) => Promise<{ success: boolean; review?: Review; error?: string }>;
  voteHelpful: (reviewId: string) => Promise<{ success: boolean; helpfulCount?: number }>;
  // Notifications
  notifications: NotificationToast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kapaly_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item: any) =>
          item &&
          item.product &&
          typeof item.product.id === 'string' &&
          typeof item.product.price === 'number' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
      );
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('College Road, Gaibandha');

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [userPanelTab, setUserPanelTab] = useState<'orders' | 'profile' | 'wishlist' | 'wallet' | 'points'>('orders');
  const [activeInfoPage, setActiveInfoPage] = useState<'replacement' | 'payment' | 'terms' | 'privacy' | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedOrderTracking, setSelectedOrderTracking] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [activeRiderOrder, setActiveRiderOrder] = useState<Order | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const reloadProducts = async () => {
    try {
      const res = await apiFetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          return;
        }
      }
      const fb = await loadStaticFallbackDb();
      const localProds = getStoredJson<Product[] | null>('fokir_local_products', null);
      setProducts(Array.isArray(localProds) ? localProds : fb.products);
    } catch (e) {
      console.warn(e);
    }
  };

  const ADMIN_SECRET = 'fokir-admin-secret-2026';

  const adminLogin = async (passcode: string) => {
    try {
      const res = await apiFetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      if (res.status === 404) throw new Error('Static fallback');
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'ভুল এডমিন পাসকোড!', 'error');
        return { success: false, message: data.error };
      }
      setUser(data.user);
      sessionStorage.setItem('fokir_admin_token', data.adminToken || ADMIN_SECRET);
      localStorage.setItem('kapaly_user', JSON.stringify(data.user));
      showToast(data.message || 'এডমিন প্যানেল আনলক করা হয়েছে!', 'success');
      return { success: true };
    } catch {
      if (passcode === 'admin2026' || passcode === ADMIN_SECRET) {
        setUser(STATIC_ADMIN_USER);
        sessionStorage.setItem('fokir_admin_token', ADMIN_SECRET);
        localStorage.setItem('kapaly_user', JSON.stringify(STATIC_ADMIN_USER));
        showToast('এডমিন ভেরিফিকেশন সফল! স্বাগতম Fokirer Bajar কন্ট্রোল প্যানেলে।', 'success');
        return { success: true };
      }
      const errMsg = 'ভুল এডমিন পাসকোড! সাধারণ গ্রাহকদের জন্য প্রবেশ সম্পূর্ণ নিষিদ্ধ।';
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const exitAdminMode = () => {
    sessionStorage.removeItem('fokir_admin_token');
    const customerUser: User = {
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
    };
    setUser(customerUser);
    localStorage.setItem('kapaly_user', JSON.stringify(customerUser));
    setIsAdminOpen(false);
    showToast('সাধারণ গ্রাহক মোডে ফিরে গেছেন। এডমিন প্যানেল বন্ধ করা হয়েছে।', 'info');
  };

  const updateOrderStatusAdmin = async (orderId: string, status: Order['orderStatus']) => {
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': sessionStorage.getItem('fokir_admin_token') || ADMIN_SECRET
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Order ${orderId} updated to ${status}`, 'success');
        refreshOrders();
        return true;
      }
      if (res.status === 404) throw new Error('Static fallback');
      return false;
    } catch {
      setOrders(prev => {
        const next = prev.map(o => (o.id === orderId ? { ...o, orderStatus: status } : o));
        setStoredJson('fokir_local_orders', next);
        return next;
      });
      showToast(`Order ${orderId} updated to ${status}`, 'success');
      return true;
    }
  };

  const addProductAdmin = async (productData: any) => {
    try {
      const res = await apiFetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': sessionStorage.getItem('fokir_admin_token') || ADMIN_SECRET
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        showToast('New product added to Fokirer Bajar!', 'success');
        await reloadProducts();
        return true;
      }
      if (res.status === 404) throw new Error('Static fallback');
      return false;
    } catch {
      const matchedCat = categories.find(c => c.slug === productData.categorySlug);
      const price = Number(productData.price) || 0;
      const orig = Number(productData.originalPrice) || price;
      const discountPercent = orig > price && orig > 0 ? Math.round(((orig - price) / orig) * 100) : 0;
      const newProduct: Product = {
        id: `kp-${Date.now().toString().slice(-4)}`,
        name: productData.name || 'New Product',
        bengaliName: productData.bengaliName || productData.name || '',
        category: productData.category || matchedCat?.name || 'Smartphones & Gadgets',
        categorySlug: productData.categorySlug || 'smartphones-gadgets',
        price,
        originalPrice: orig,
        discountPercent,
        badge: productData.badge || 'Cyclone Deal ⚡',
        rating: 5.0,
        reviewsCount: 0,
        soldCount: 0,
        stock: Number(productData.stock) || 20,
        image: productData.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
        images: [productData.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'],
        description: productData.description || 'Authentic product from Fokirer Bajar Gaibandha Hub.',
        features: Array.isArray(productData.features) ? productData.features : ['100% Authentic Warranty', 'Fast Gaibandha Delivery'],
        brand: productData.brand || 'Fokirer Bajar Official',
        isCyclone: Boolean(productData.isCyclone),
        isExpress: true,
        seller: productData.seller || 'Fokirer Bajar Official Flagship'
      };
      setProducts(prev => {
        const next = [newProduct, ...prev];
        setStoredJson('fokir_local_products', next);
        return next;
      });
      showToast('New product added to Fokirer Bajar!', 'success');
      return true;
    }
  };

  const updateProductAdmin = async (id: string, updates: any) => {
    try {
      const res = await apiFetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': sessionStorage.getItem('fokir_admin_token') || ADMIN_SECRET
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        showToast('Product updated successfully', 'success');
        await reloadProducts();
        return true;
      }
      if (res.status === 404) throw new Error('Static fallback');
      return false;
    } catch {
      setProducts(prev => {
        const next = prev.map(p => (p.id === id ? { ...p, ...updates } : p));
        setStoredJson('fokir_local_products', next);
        return next;
      });
      showToast('Product updated successfully', 'success');
      return true;
    }
  };

  const deleteProductAdmin = async (id: string) => {
    try {
      const res = await apiFetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': sessionStorage.getItem('fokir_admin_token') || ADMIN_SECRET
        }
      });
      if (res.ok) {
        showToast('Product removed from catalog', 'info');
        await reloadProducts();
        return true;
      }
      if (res.status === 404) throw new Error('Static fallback');
      return false;
    } catch {
      setProducts(prev => {
        const next = prev.filter(p => p.id !== id);
        setStoredJson('fokir_local_products', next);
        return next;
      });
      showToast('Product removed from catalog', 'info');
      return true;
    }
  };

  const openInvoice = (order: Order) => {
    setActiveInvoiceOrder(order);
    setIsInvoiceModalOpen(true);
  };

  const openRiderTracking = (order: Order) => {
    setActiveRiderOrder(order);
    setIsRiderModalOpen(true);
  };

  // Load initial data from backend API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [infoRes, catRes, prodRes] = await Promise.all([
          apiFetch('/api/info').then(r => (r.ok ? r.json() : null)).catch(() => null),
          apiFetch('/api/categories').then(r => (r.ok ? r.json() : null)).catch(() => null),
          apiFetch('/api/products').then(r => (r.ok ? r.json() : null)).catch(() => null)
        ]);

        const needsStaticFallback = !Array.isArray(prodRes) || !Array.isArray(catRes);
        const fallbackDb = needsStaticFallback ? await loadStaticFallbackDb() : null;

        if (infoRes && typeof infoRes === 'object' && !infoRes.error) {
          setStoreInfo(infoRes);
        } else {
          setStoreInfo(STATIC_STORE_INFO);
        }
        if (Array.isArray(catRes)) {
          setCategories(catRes);
        } else if (fallbackDb) {
          setCategories(fallbackDb.categories);
        }
        if (Array.isArray(prodRes)) {
          setProducts(prodRes);
        } else if (fallbackDb) {
          const localProds = getStoredJson<Product[] | null>('fokir_local_products', null);
          setProducts(Array.isArray(localProds) && localProds.length > 0 ? localProds : fallbackDb.products);
        }

        // Check if there's a stored user safely
        const storedUser = localStorage.getItem('kapaly_user');
        const hasExplicitlyLoggedOut = localStorage.getItem('fokir_user_logged_out') === 'true';
        let restoredUser: User | null = null;
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed && typeof parsed === 'object' && typeof parsed.id === 'string' && typeof parsed.name === 'string') {
              restoredUser = {
                ...parsed,
                balance: typeof parsed.balance === 'number' ? parsed.balance : 0,
                points: typeof parsed.points === 'number' ? parsed.points : 0,
                wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : []
              };
            } else {
              localStorage.removeItem('kapaly_user');
            }
          } catch {
            localStorage.removeItem('kapaly_user');
          }
        }

        if (restoredUser) {
          setUser(restoredUser);
          setWishlist(restoredUser.wishlist || []);
          fetchOrders(restoredUser.id);
        } else if (!hasExplicitlyLoggedOut) {
          // Auto login demo user on first arrival only if not explicitly logged out
          const demoRes = await apiFetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: 'shabbirmahamudcontact@gmail.com' })
          }).then(r => (r.ok ? r.json() : null)).catch(() => null);
          if (demoRes?.user) {
            setUser(demoRes.user);
            setWishlist(Array.isArray(demoRes.user.wishlist) ? demoRes.user.wishlist : []);
            localStorage.setItem('kapaly_user', JSON.stringify(demoRes.user));
            fetchOrders(demoRes.user.id);
          } else {
            const staticDemoUser: User = {
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
            };
            setUser(staticDemoUser);
            setWishlist(staticDemoUser.wishlist || []);
            localStorage.setItem('kapaly_user', JSON.stringify(staticDemoUser));
            fetchOrders(staticDemoUser.id);
          }
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kapaly_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}_${Math.random()}`;
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name.slice(0, 28)}..." to cart!`, 'success');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Please login to save to wishlist', 'info');
      return;
    }

    try {
      const res = await apiFetch('/api/auth/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.wishlist) {
          setWishlist(data.wishlist);
          const added = data.wishlist.includes(productId);
          showToast(added ? 'Saved to your Wishlist!' : 'Removed from Wishlist', 'info');
          const updatedUser = { ...user, wishlist: data.wishlist };
          setUser(updatedUser);
          localStorage.setItem('kapaly_user', JSON.stringify(updatedUser));
          return;
        }
      }
      throw new Error('Fallback wishlist');
    } catch {
      const exists = wishlist.includes(productId);
      const nextWishlist = exists ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
      setWishlist(nextWishlist);
      const updatedUser = { ...user, wishlist: nextWishlist };
      setUser(updatedUser);
      localStorage.setItem('kapaly_user', JSON.stringify(updatedUser));
      showToast(!exists ? 'Saved to your Wishlist!' : 'Removed from Wishlist', 'info');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const fetchOrders = async (userId: string) => {
    try {
      const response = await apiFetch(`/api/orders?userId=${userId}`);
      if (response.ok) {
        const res = await response.json();
        if (Array.isArray(res)) {
          setOrders(res);
          return;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    const savedLocal = getStoredJson<Order[] | null>('fokir_local_orders', null);
    if (Array.isArray(savedLocal)) {
      setOrders(savedLocal);
      return;
    }
    const fb = await loadStaticFallbackDb();
    if (Array.isArray(fb.orders)) {
      setStoredJson('fokir_local_orders', fb.orders);
      setOrders(fb.orders);
    }
  };

  const refreshOrders = async () => {
    if (user?.id) {
      await fetchOrders(user.id);
    }
  };

  const login = async (identifier: string) => {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      if (res.status === 404) {
        throw new Error('Static fallback');
      }
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Login failed', 'error');
        return { success: false, message: data.error };
      }
      setUser(data.user);
      setWishlist(data.user.wishlist || []);
      localStorage.removeItem('fokir_user_logged_out');
      localStorage.setItem('kapaly_user', JSON.stringify(data.user));
      fetchOrders(data.user.id);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      const cleanId = identifier.trim();
      const localUser: User = {
        id: `usr_local_${Date.now()}`,
        name: cleanId.includes('@') ? cleanId.split('@')[0] : 'Gaibandha Shopper',
        phone: cleanId.includes('@') ? '01712345678' : cleanId,
        email: cleanId.includes('@') ? cleanId : `${cleanId}@fokirerbajar.bd`,
        role: 'customer',
        address: 'College Road, Gaibandha',
        city: 'Gaibandha Sadar',
        division: 'Rangpur',
        zipCode: '5700',
        balance: 2450,
        points: 850,
        createdAt: new Date().toISOString(),
        wishlist: ['kp-101', 'kp-103']
      };
      setUser(localUser);
      setWishlist(localUser.wishlist || []);
      localStorage.removeItem('fokir_user_logged_out');
      localStorage.setItem('kapaly_user', JSON.stringify(localUser));
      showToast(`Welcome back, ${localUser.name}!`, 'success');
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const register = async (formData: { name: string; phone: string; email?: string; address?: string }) => {
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.status === 404) {
        throw new Error('Static fallback');
      }
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Registration failed', 'error');
        return { success: false, message: data.error };
      }
      setUser(data.user);
      setWishlist([]);
      localStorage.removeItem('fokir_user_logged_out');
      localStorage.setItem('kapaly_user', JSON.stringify(data.user));
      showToast(data.message || 'Account created with ৳100 welcome bonus!', 'success');
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      const localUser: User = {
        id: `usr_local_${Date.now()}`,
        name: formData.name,
        phone: formData.phone || '01700000000',
        email: formData.email || `${formData.phone}@fokirerbajar.bd`,
        role: 'customer',
        address: formData.address || 'College Road, Gaibandha',
        city: 'Gaibandha Sadar',
        division: 'Rangpur',
        zipCode: '5700',
        balance: 100,
        points: 50,
        createdAt: new Date().toISOString(),
        wishlist: []
      };
      setUser(localUser);
      setWishlist([]);
      localStorage.removeItem('fokir_user_logged_out');
      localStorage.setItem('kapaly_user', JSON.stringify(localUser));
      showToast('Account created with ৳100 welcome bonus!', 'success');
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setWishlist([]);
    setOrders([]);
    localStorage.removeItem('kapaly_user');
    localStorage.setItem('fokir_user_logged_out', 'true');
    showToast('You have been logged out of Fokirer Bajar', 'info');
    setIsUserPanelOpen(false);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return false;
    try {
      const res = await apiFetch(`/api/auth/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        localStorage.setItem('kapaly_user', JSON.stringify(updated));
        showToast('Profile updated successfully!', 'success');
        return true;
      }
      if (res.status === 404) throw new Error('Static fallback');
      return false;
    } catch {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('kapaly_user', JSON.stringify(updated));
      showToast('Profile updated successfully!', 'success');
      return true;
    }
  };

  const placeOrder = async (orderPayload: any) => {
    try {
      const res = await apiFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.status === 404) throw new Error('Static fallback');
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to place order', 'error');
        return { success: false, error: data.error };
      }
      // Success: clear cart and update orders
      clearCart();
      if (data.updatedUser) {
        setUser(data.updatedUser);
        try {
          localStorage.setItem('kapaly_user', JSON.stringify(data.updatedUser));
        } catch (e) {
          console.warn(e);
        }
      }
      if (user?.id) {
        fetchOrders(user.id);
      }
      showToast('Order confirmed! Tracking ID generated.', 'success');
      return { success: true, order: data.order };
    } catch {
      const localOrder = createLocalDemoOrder(orderPayload);
      clearCart();
      setOrders(prev => {
        const next = [localOrder, ...prev];
        try {
          localStorage.setItem('fokir_local_orders', JSON.stringify(next));
        } catch {
          // Ignore storage error
        }
        return next;
      });
      if (user) {
        const nextPoints = Math.max(0, (user.points ?? 0) - (Number(orderPayload.pointsUsed) || 0)) + (localOrder.pointsEarned || 0);
        const updatedUser = { ...user, points: nextPoints };
        setUser(updatedUser);
        try {
          localStorage.setItem('kapaly_user', JSON.stringify(updatedUser));
        } catch {
          // Ignore storage error
        }
      }
      showToast('Order confirmed! Tracking ID generated.', 'success');
      return { success: true, order: localOrder };
    }
  };

  const submitReview = async (productId: string, reviewData: { rating: number; comment: string; title?: string; userName?: string; location?: string }) => {
    try {
      const res = await apiFetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewData,
          userId: user?.id,
          userName: reviewData.userName || user?.name || 'Customer at College Road',
          location: reviewData.location || user?.city || selectedLocation || 'College Road, Gaibandha'
        })
      });
      if (res.status === 404) throw new Error('Static fallback');
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to submit review', 'error');
        return { success: false, error: data.error };
      }

      // Update products state with new product rating and reviewsCount
      if (data.product) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, rating: data.product.rating, reviewsCount: data.product.reviewsCount } : p));
        if (quickViewProduct?.id === productId) {
          setQuickViewProduct({ ...quickViewProduct, rating: data.product.rating, reviewsCount: data.product.reviewsCount });
        }
      }

      showToast(data.message || 'Review submitted successfully! Thank you.', 'success');
      return { success: true, review: data.review };
    } catch {
      const localReview: Review = {
        id: `rev_local_${Date.now()}`,
        productId,
        userId: user?.id,
        userName: reviewData.userName || user?.name || 'Customer at College Road',
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
        verifiedPurchase: true,
        helpfulCount: 0,
        location: reviewData.location || user?.city || selectedLocation || 'College Road, Gaibandha'
      };
      const existingLocalReviews = getStoredJson<Review[]>('fokir_local_reviews', []);
      const updatedLocalReviews = [localReview, ...existingLocalReviews];
      setStoredJson('fokir_local_reviews', updatedLocalReviews);

      const fb = await loadStaticFallbackDb();
      const allProdReviews = [...updatedLocalReviews, ...fb.reviews].filter(r => r.productId === productId);
      const avgRating = allProdReviews.length > 0
        ? Number((allProdReviews.reduce((sum, r) => sum + r.rating, 0) / allProdReviews.length).toFixed(1))
        : reviewData.rating;
      const reviewsCount = allProdReviews.length;

      setProducts(prev => {
        const next = prev.map(p => (p.id === productId ? { ...p, rating: avgRating, reviewsCount } : p));
        setStoredJson('fokir_local_products', next);
        return next;
      });
      if (quickViewProduct?.id === productId) {
        setQuickViewProduct({ ...quickViewProduct, rating: avgRating, reviewsCount });
      }
      showToast('Review submitted! Thank you for your feedback.', 'success');
      return { success: true, review: localReview };
    }
  };

  const voteHelpful = async (reviewId: string) => {
    try {
      const res = await apiFetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, helpfulCount: data.helpfulCount };
      }
      if (res.status === 404) throw new Error('Static fallback');
      return { success: false };
    } catch {
      const helpfulMap = getStoredJson<Record<string, number>>('fokir_local_helpful', {});
      helpfulMap[reviewId] = (helpfulMap[reviewId] || 0) + 1;
      setStoredJson('fokir_local_helpful', helpfulMap);
      return { success: true, helpfulCount: helpfulMap[reviewId] };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        wishlist,
        orders,
        categories,
        products,
        storeInfo,
        loading,
        selectedLocation,
        setSelectedLocation,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        toggleWishlist,
        isInWishlist,
        login,
        register,
        logout,
        updateProfile,
        refreshOrders,
        placeOrder,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isUserPanelOpen,
        setIsUserPanelOpen,
        userPanelTab,
        setUserPanelTab,
        activeInfoPage,
        setActiveInfoPage,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        selectedOrderTracking,
        setSelectedOrderTracking,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        activeInvoiceOrder,
        openInvoice,
        isRiderModalOpen,
        setIsRiderModalOpen,
        activeRiderOrder,
        openRiderTracking,
        isAiChatOpen,
        setIsAiChatOpen,
        isAdminOpen,
        setIsAdminOpen,
        adminLogin,
        exitAdminMode,
        updateOrderStatusAdmin,
        addProductAdmin,
        updateProductAdmin,
        deleteProductAdmin,
        reloadProducts,
        submitReview,
        voteHelpful,
        notifications,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
