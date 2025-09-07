import { createContext, useContext, useState, ReactNode } from 'react';
import grilledChickenSalad from '../assets/grilled-chicken-salad.jpg';
import beefBurger from '../assets/beef-burger.jpg';
import margheritaPizza from '../assets/margherita-pizza.jpg';
import caesarWrap from '../assets/caesar-wrap.jpg';
import fishChips from '../assets/fish-chips.jpg';
import pastaCarbonara from '../assets/pasta-carbonara.jpg';

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
  items: number;
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
    name: 'Grilled Chicken Salad',
    price: 12.99,
    rating: 4.5,
    image: grilledChickenSalad,
    category: 'Salads'
  },
  {
    id: '2', 
    name: 'Beef Burger Deluxe',
    price: 15.99,
    rating: 4.7,
    image: beefBurger,
    category: 'Burgers'
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    price: 18.99,
    rating: 4.6,
    image: margheritaPizza,
    category: 'Pizza'
  },
  {
    id: '4',
    name: 'Caesar Wrap',
    price: 9.99,
    rating: 4.3,
    image: caesarWrap,
    category: 'Wraps'
  },
  {
    id: '5',
    name: 'Fish & Chips',
    price: 16.99,
    rating: 4.4,
    image: fishChips,
    category: 'Seafood'
  },
  {
    id: '6',
    name: 'Pasta Carbonara',
    price: 14.99,
    rating: 4.8,
    image: pastaCarbonara,
    category: 'Pasta'
  }
];

const dummyOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'NSU001',
    items: 3,
    price: 42.97,
    date: '2024-01-07',
    time: '12:30 PM',
    status: 'preparing'
  },
  {
    id: '2',
    orderNumber: 'NSU002', 
    items: 2,
    price: 28.98,
    date: '2024-01-07',
    time: '11:45 AM',
    status: 'ready'
  },
  {
    id: '3',
    orderNumber: 'NSU003',
    items: 1,
    price: 15.99,
    date: '2024-01-06',
    time: '2:15 PM',
    status: 'delivered'
  },
  {
    id: '4',
    orderNumber: 'NSU004',
    items: 4,
    price: 58.96,
    date: '2024-01-06',
    time: '1:20 PM', 
    status: 'delivered'
  },
  {
    id: '5',
    orderNumber: 'NSU005',
    items: 2,
    price: 31.98,
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
    
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `NSU${String(state.orders.length + 1).padStart(3, '0')}`,
      items: state.cartCount,
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