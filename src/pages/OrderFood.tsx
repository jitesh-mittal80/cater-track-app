import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { useToast } from '../hooks/use-toast';
import MenuCard from '../components/MenuCard';

const OrderFood = () => {
  const { state, addToCart, placeOrder } = useApp();
  const { toast } = useToast();
  const [isOrdering, setIsOrdering] = useState(false);

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handlePlaceOrder = async () => {
    if (state.cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    setIsOrdering(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      placeOrder();
      toast({
        title: "Order placed successfully!",
        description: "Your order has been submitted and is being prepared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  const totalPrice = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="p-6">
      {/* Header with Cart */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order Food</h1>
          <p className="text-muted-foreground">Choose from our delicious menu</p>
        </div>
        
        <div className="flex items-center gap-4">
          {state.cartCount > 0 && (
            <div className="bg-card border border-border rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="font-medium">{state.cartCount} items</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-bold text-primary">₹{totalPrice.toFixed(0)}</span>
                </div>
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isOrdering}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  {isOrdering ? (
                    'Placing...'
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.menuItems.map(item => (
          <MenuCard 
            key={item.id} 
            item={item} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Empty State */}
      {state.menuItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No menu items available</p>
        </div>
      )}
    </div>
  );
};

export default OrderFood;