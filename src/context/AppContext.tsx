import { createContext, useContext, useState, ReactNode } from 'react';
import paneerTikka from '../assets/paneer-tikka.jpg';
import vegBiryani from '../assets/veg-biryani.jpg';
import choleBhature from '../assets/chole-bhature.jpg';
import masalaDosa from '../assets/masala-dosa.jpg';
import palakPaneer from '../assets/palak-paneer.jpg';
import rajmaChawal from '../assets/rajma-chawal.jpg';

// User type
interface User {
  id: string;
  name: string;
  email: string;
}

// Order type
interface Order {
  id: string;
  orderNumber: string;
  items: string[]; // Array of food item names
  itemCount: number; // Total count for display
  price: number;
  date: string;
  time: string;
  status: 'placed' | 'preparing' | 'ready' | 'delivered';
}

// Menu item type
interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

// Cart item type
interface CartItem extends MenuItem {
  quantity: number;
}

// App state type
interface AppState {
  user: User | null;
  orders: Order[];
  menuItems: MenuItem[];
  cart: CartItem[];
  cartCount: number;
}

// Context type
interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: () => void;
}

// Dummy data
const dummyMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Paneer Tikka Masala',
    price: 250,
    rating: 4.5,
    image: paneerTikka,
    category: 'North Indian'
  },
  {
    id: '2', 
    name: 'Vegetable Biryani',
    price: 180,
    rating: 4.7,
    image: vegBiryani,
    category: 'Rice'
  },
  {
    id: '3',
    name: 'Chole Bhature',
    price: 120,
    rating: 4.6,
    image: choleBhature,
    category: 'North Indian'
  },
  {
    id: '4',
    name: 'Masala Dosa',
    price: 90,
    rating: 4.3,
    image: masalaDosa,
    category: 'South Indian'
  },
  {
    id: '5',
    name: 'Palak Paneer with Roti',
    price: 220,
    rating: 4.4,
    image: palakPaneer,
    category: 'North Indian'
  },
  {
    id: '6',
    name: 'Rajma Chawal',
    price: 140,
    rating: 4.8,
    image: rajmaChawal,
    category: 'Comfort Food'
  }
];

const dummyOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'NSU001',
    items: ['Paneer Tikka Masala', 'Vegetable Biryani', 'Masala Dosa'],
    itemCount: 3,
    price: 520,
    date: '2024-01-07',
    time: '12:30 PM',
    status: 'preparing'
  },
  {
    id: '2',
    orderNumber: 'NSU002', 
    items: ['Chole Bhature', 'Palak Paneer with Roti'],
    itemCount: 2,
    price: 340,
    date: '2024-01-07',
    time: '11:45 AM',
    status: 'ready'
  },
  {
    id: '3',
    orderNumber: 'NSU003',
    items: ['Rajma Chawal'],
    itemCount: 1,
    price: 140,
    date: '2024-01-06',
    time: '2:15 PM',
    status: 'delivered'
  },
  {
    id: '4',
    orderNumber: 'NSU004',
    items: ['Paneer Tikka Masala', 'Vegetable Biryani', 'Chole Bhature', 'Masala Dosa'],
    itemCount: 4,
    price: 640,
    date: '2024-01-06',
    time: '1:20 PM', 
    status: 'delivered'
  },
  {
    id: '5',
    orderNumber: 'NSU005',
    items: ['Palak Paneer with Roti', 'Rajma Chawal'],
    itemCount: 2,
    price: 360,
    date: '2024-01-05',
    time: '12:00 PM',
    status: 'delivered'
  }
];

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    orders: dummyOrders,
    menuItems: dummyMenuItems,
    cart: [],
    cartCount: 0
  });

  const login = (email: string, password: string): boolean => {
    // Simple dummy authentication
    if (email && password) {
      const user: User = {
        id: '1',
        name: 'John Smith',
        email: email
      };
      setState(prev => ({ ...prev, user }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, user: null, cart: [], cartCount: 0 }));
  };

  const addToCart = (item: MenuItem) => {
    setState(prev => {
      const existingItem = prev.cart.find(cartItem => cartItem.id === item.id);
      let newCart;
      
      if (existingItem) {
        newCart = prev.cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCart = [...prev.cart, { ...item, quantity: 1 }];
      }
      
      const cartCount = newCart.reduce((total, cartItem) => total + cartItem.quantity, 0);
      
      return { ...prev, cart: newCart, cartCount };
    });
  };

  const removeFromCart = (itemId: string) => {
    setState(prev => {
      const newCart = prev.cart.filter(item => item.id !== itemId);
      const cartCount = newCart.reduce((total, cartItem) => total + cartItem.quantity, 0);
      return { ...prev, cart: newCart, cartCount };
    });
  };

  const clearCart = () => {
    setState(prev => ({ ...prev, cart: [], cartCount: 0 }));
  };

  const placeOrder = () => {
    if (state.cart.length === 0) return;
    
    const itemNames = state.cart.map(item => item.name);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `NSU${String(state.orders.length + 1).padStart(3, '0')}`,
      items: itemNames,
      itemCount: state.cartCount,
      price: state.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'placed'
    };

    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      cart: [],
      cartCount: 0
    }));
  };

  return (
    <AppContext.Provider value={{
      state,
      login,
      logout,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};