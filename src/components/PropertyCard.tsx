import { Bed, Bath, Car, Square, MapPin, Eye, ImageOff } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const PLACEHOLDER_IMAGE = '/placeholder.svg';

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
  id,
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
  const navigate = useNavigate();
  
  // Use placeholder if no images
  const displayImages = images && images.length > 0 ? images : [PLACEHOLDER_IMAGE];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  return (
    <div onClick={() => navigate(`/property/${id}`)} className="card-property group cursor-pointer">
      {/* Image Carousel */}
      <div className="relative overflow-hidden">
        {displayImages.length > 1 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {displayImages.map((image, index) => (
                <CarouselItem key={index}>
                  <AspectRatio ratio={4/3}>
                    <img 
                      src={image} 
                      alt={`${title} - Foto ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <AspectRatio ratio={4/3}>
            {displayImages[0] === PLACEHOLDER_IMAGE ? (
              <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
                <ImageOff className="w-12 h-12 mb-2" />
                <span className="text-sm">Sem imagem</span>
              </div>
            ) : (
              <img 
                src={displayImages[0]} 
                alt={title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={handleImageError}
              />
            )}
          </AspectRatio>
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
      <div className="p-6 bg-card shadow-xl border border-border rounded-b-lg">
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
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Bed className="w-4 h-4" />
            <span className="text-sm">{bedrooms} quartos</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{bathrooms} banheiros</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Car className="w-4 h-4" />
            <span className="text-sm">{parking} vagas</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
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
