import { Star, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuCard = ({ item, onAddToCart }: MenuCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-hover transition-all duration-200 group">
      <div className="aspect-square bg-gradient-card overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">{item.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₹{item.price}</span>
          <Button 
            onClick={() => onAddToCart(item)}
            size="sm"
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;