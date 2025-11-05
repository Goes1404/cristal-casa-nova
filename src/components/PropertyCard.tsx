import { Bed, Bath, Car, Square, MapPin, Eye } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface PropertyCardProps {
  id: string | number;
  images: string[];
  type: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  price: string;
}

const PropertyCard = ({ 
  images, 
  type, 
  title, 
  location, 
  bedrooms, 
  bathrooms, 
  parking, 
  area, 
  price 
}: PropertyCardProps) => {
  return (
    <div className="card-property group">
      {/* Image Carousel */}
      <div className="relative overflow-hidden">
        {images.length > 1 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <img 
                    src={image} 
                    alt={`${title} - Foto ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <img 
            src={images[0] || ''} 
            alt={title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-accent text-white px-3 py-1 rounded-full text-sm font-medium">
            {type}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center space-x-2 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-xl text-primary mb-4 line-clamp-2">
          {title}
        </h3>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-crystal-gray">
            <Bed className="w-4 h-4" />
            <span className="text-sm">{bedrooms} quartos</span>
          </div>
          <div className="flex items-center space-x-2 text-crystal-gray">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{bathrooms} banheiros</span>
          </div>
          <div className="flex items-center space-x-2 text-crystal-gray">
            <Car className="w-4 h-4" />
            <span className="text-sm">{parking} vagas</span>
          </div>
          <div className="flex items-center space-x-2 text-crystal-gray">
            <Square className="w-4 h-4" />
            <span className="text-sm">{area}m²</span>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">{price}</div>
          </div>
          <button className="btn-outline hover:scale-105 transition-transform">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;