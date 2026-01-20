import { Bed, Bath, Car, Square, MapPin, Eye, ImageOff } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';

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
    <motion.div 
      onClick={() => navigate(`/property/${id}`)} 
      className="card-property group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -8, scale: 1.01 }}
    >
      {/* Image Carousel */}
      <div className="relative overflow-hidden rounded-t-2xl">
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
            <CarouselPrevious className="left-3 h-10 w-10 bg-background/80 backdrop-blur-sm border-0 shadow-medium hover:bg-background" />
            <CarouselNext className="right-3 h-10 w-10 bg-background/80 backdrop-blur-sm border-0 shadow-medium hover:bg-background" />
          </Carousel>
        ) : (
          <AspectRatio ratio={4/3}>
            {displayImages[0] === PLACEHOLDER_IMAGE ? (
              <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
                <ImageOff className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-sm font-medium">Sem imagem</span>
              </div>
            ) : (
              <img 
                src={displayImages[0]} 
                alt={title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={handleImageError}
              />
            )}
          </AspectRatio>
        )}
        
        {/* Type Badge - Glassmorphism */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-accent text-white shadow-medium">
            {type}
          </span>
        </div>
        
        {/* Eye Button - Glassmorphism */}
        <div className="absolute top-4 right-4 z-10">
          <button className="w-11 h-11 bg-background/60 backdrop-blur-xl rounded-xl flex items-center justify-center text-foreground hover:bg-background/80 transition-all duration-300 border border-border/30 shadow-soft">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-card">
        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{location}</span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-xl text-foreground mb-5 line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{bedrooms} quartos</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <Bath className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{bathrooms} banheiros</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{parking} vagas</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <Square className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{area}m²</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 mb-5" />

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Valor</p>
            <div className="text-2xl font-bold text-primary">{price}</div>
          </div>
          <button className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-medium">
            Ver Detalhes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
