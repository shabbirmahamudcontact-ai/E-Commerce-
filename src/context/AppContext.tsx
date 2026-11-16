import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, User, CartItem, Order, Category, StoreInfo, Review } from '../types.ts';

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
      return saved ? JSON.parse(saved) : [];
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
      const res = await fetch('/api/products').then(r => r.json());
      if (Array.isArray(res)) setProducts(res);
    } catch (e) {
      console.warn(e);
    }
  };

  const ADMIN_SECRET = 'fokir-admin-secret-2026';

  const adminLogin = async (passcode: string) => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
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
      showToast('এডমিন ভেরিফিকেশন ব্যর্থ হয়েছে', 'error');
      return { success: false };
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
      const res = await fetch(`/api/orders/${orderId}/status`, {
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
      return false;
    } catch {
      showToast('Failed to update order status', 'error');
      return false;
    }
  };

  const addProductAdmin = async (productData: any) => {
    try {
      const res = await fetch('/api/products', {
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
      return false;
    } catch {
      showToast('Failed to add product', 'error');
      return false;
    }
  };

  const updateProductAdmin = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
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
      return false;
    } catch {
      showToast('Failed to update product', 'error');
      return false;
    }
  };

  const deleteProductAdmin = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
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
      return false;
    } catch {
      showToast('Failed to delete product', 'error');
      return false;
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
          fetch('/api/info').then(r => r.json()),
          fetch('/api/categories').then(r => r.json()),
          fetch('/api/products').then(r => r.json())
        ]);
        setStoreInfo(infoRes);
        setCategories(catRes);
        setProducts(prodRes);

        // Check if there's a stored user
        const storedUser = localStorage.getItem('kapaly_user');
        const hasExplicitlyLoggedOut = localStorage.getItem('fokir_user_logged_out') === 'true';
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setWishlist(parsed.wishlist || []);
          fetchOrders(parsed.id);
        } else if (!hasExplicitlyLoggedOut) {
          // Auto login demo user on first arrival only if not explicitly logged out
          const demoRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: 'shabbirmahamudcontact@gmail.com' })
          }).then(r => r.json());
          if (demoRes?.user) {
            setUser(demoRes.user);
            setWishlist(demoRes.user.wishlist || []);
            localStorage.setItem('kapaly_user', JSON.stringify(demoRes.user));
            fetchOrders(demoRes.user.id);
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
      const res = await fetch('/api/auth/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId })
      }).then(r => r.json());

      if (res.wishlist) {
        setWishlist(res.wishlist);
        const added = res.wishlist.includes(productId);
        showToast(added ? 'Saved to your Wishlist!' : 'Removed from Wishlist', 'info');
        if (user) {
          const updatedUser = { ...user, wishlist: res.wishlist };
          setUser(updatedUser);
          localStorage.setItem('kapaly_user', JSON.stringify(updatedUser));
        }
      }
    } catch {
      showToast('Error updating wishlist', 'error');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const fetchOrders = async (userId: string) => {
    try {
      const res = await fetch(`/api/orders?userId=${userId}`).then(r => r.json());
      if (Array.isArray(res)) {
        setOrders(res);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const refreshOrders = async () => {
    if (user?.id) {
      await fetchOrders(user.id);
    }
  };

  const login = async (identifier: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
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
      showToast('Connection failed to Fokirer Bajar server', 'error');
      return { success: false };
    }
  };

  const register = async (formData: { name: string; phone: string; email?: string; address?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
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
      showToast('Network error during registration', 'error');
      return { success: false };
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
      const res = await fetch(`/api/auth/user/${user.id}`, {
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
      return false;
    } catch {
      showToast('Failed to update profile', 'error');
      return false;
    }
  };

  const placeOrder = async (orderPayload: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
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
      showToast('Network error during order placement', 'error');
      return { success: false, error: 'Network error' };
    }
  };

  const submitReview = async (productId: string, reviewData: { rating: number; comment: string; title?: string; userName?: string; location?: string }) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewData,
          userId: user?.id,
          userName: reviewData.userName || user?.name || 'Customer at College Road',
          location: reviewData.location || user?.city || selectedLocation || 'College Road, Gaibandha'
        })
      });
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
      showToast('Network error while posting review', 'error');
      return { success: false, error: 'Network error' };
    }
  };

  const voteHelpful = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, helpfulCount: data.helpfulCount };
      }
      return { success: false };
    } catch {
      return { success: false };
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
