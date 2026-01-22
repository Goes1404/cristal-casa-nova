import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Bed, Bath, Car, Maximize, MapPin, ArrowLeft, Phone, MessageCircle, ImageOff } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { formatCurrency, formatCurrencyFull } from '@/lib/formatCurrency';
const PLACEHOLDER_IMAGE = '/placeholder.svg';
const PropertyDetail = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    data: property,
    isLoading
  } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('properties').select(`
          *,
          property_images (
            image_url,
            is_primary,
            display_order
          )
        `).eq('id', id).single();
      if (error) throw error;
      return data;
    }
  });
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">
        <p>Imóvel não encontrado</p>
      </div>;
  }
  const sortedImages = property.property_images && property.property_images.length > 0 ? [...property.property_images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map(img => img.image_url) : [PLACEHOLDER_IMAGE];
  const typeMap: Record<string, string> = {
    'apartamento': 'Apartamento',
    'casa': 'Casa',
    'cobertura': 'Cobertura',
    'terreno': 'Terreno',
    'comercial': 'Comercial'
  };
  return <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-12 bg-muted dark:bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-crystal-gray hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {sortedImages.map((image, index) => <CarouselItem key={index}>
                          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                            {image === PLACEHOLDER_IMAGE ? <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                <ImageOff className="w-16 h-16 mb-2" />
                                <span>Sem imagem</span>
                              </div> : <img src={image} alt={`${property.title} - Foto ${index + 1}`} className="w-full h-full object-cover" onError={e => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        }} />}
                          </div>
                        </CarouselItem>)}
                    </CarouselContent>
                    {sortedImages.length > 1 && <>
                        <CarouselPrevious />
                        <CarouselNext />
                      </>}
                  </Carousel>
                  
                  {/* Thumbnail indicators */}
                  {sortedImages.length > 1 && <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {sortedImages.slice(0, 5).map((image, index) => <div key={index} className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer">
                          <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </div>)}
                      {sortedImages.length > 5 && <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
                          +{sortedImages.length - 5}
                        </div>}
                    </div>}
                </div>

                {/* Details */}
                <div>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                      {typeMap[property.type] || property.type}
                    </span>
                  </div>

                  <h1 className="heading-section mb-4">{property.title}</h1>

                  <div className="flex items-center text-muted-foreground mb-6">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location}</span>
                  </div>

                  <div className="mb-8">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {formatCurrency(Number(property.price))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrencyFull(Number(property.price))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Bed className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Quartos</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Bath className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Banheiros</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Car className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.parking}</div>
                      <div className="text-sm text-muted-foreground">Vagas</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Maximize className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.area}</div>
                      <div className="text-sm text-muted-foreground">m²</div>
                    </div>
                  </div>

                  {property.description && <div className="mb-8">
                      <h2 className="text-xl font-bold text-primary mb-4">Descrição</h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {property.description}
                      </p>
                    </div>}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="https://wa.me/5511996188216" target="_blank" rel="noopener noreferrer" className="btn-hero flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                    <a href="tel:+5511996188216" className="btn-outline flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      Ligar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default PropertyDetail;