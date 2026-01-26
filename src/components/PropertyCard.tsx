import { Bed, Bath, Car, Square, MapPin, MessageCircle, ImageOff } from 'lucide-react';
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
  bedrooms: number | string;
  bathrooms: number | string;
  parking: number | string;
  area: number | string;
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
          <a 
            href={`https://wa.me/5511996188216?text=${encodeURIComponent(
              `Olá! Vi no site e tenho interesse no imóvel: ${title} (Código: ${id}), no valor de ${price}. Pode me ajudar?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 bg-green-500/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 lg:p-6 bg-card shadow-xl border border-border rounded-b-lg">
        {/* Location */}
        <div className="flex items-center space-x-2 text-muted-foreground mb-2 lg:mb-3">
          <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="text-sm lg:text-base">{location}</span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-lg sm:text-xl lg:text-2xl text-primary mb-3 lg:mb-4 line-clamp-2">
          {title}
        </h3>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Bed className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-sm lg:text-base">{bedrooms} quartos</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Bath className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-sm lg:text-base">{bathrooms} banheiros</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Car className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-sm lg:text-base">{parking} vagas</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Square className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-sm lg:text-base">{area}m²</span>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs lg:text-sm text-muted-foreground">a partir de</p>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{price}</div>
          </div>
          <button className="border-2 border-primary text-primary bg-transparent px-3 sm:px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 text-sm lg:text-base font-medium">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
