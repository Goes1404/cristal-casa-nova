import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard from './PropertyCard';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
const PropertiesSection = () => {
  const {
    data: properties,
    isLoading
  } = useQuery({
    queryKey: ['properties'],
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
        `).eq('status', 'disponivel').order('created_at', {
        ascending: false
      }).limit(3);
      if (error) throw error;
      return data;
    }
  });
  const typeMap: Record<string, string> = {
    'apartamento': 'Apartamento',
    'casa': 'Casa',
    'cobertura': 'Cobertura',
    'terreno': 'Terreno',
    'comercial': 'Comercial'
  };
  return <section id="properties" className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4 bg-primary-foreground dark:bg-background my-[15px]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="heading-section text-primary">Nossos Imóveis em Destaque</h2>
            <p className="text-lead max-w-2xl mx-auto">
              Descubra uma seleção cuidadosa dos melhores imóveis disponíveis, 
              com qualidade e localização privilegiada.
            </p>
          </div>

          {/* Properties Grid */}
          {isLoading ? <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div> : properties && properties.length > 0 ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {properties.map(property => {
            const sortedImages = [...property.property_images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map(img => img.image_url);
            return <PropertyCard key={property.id} id={property.id} images={sortedImages} type={typeMap[property.type] || property.type} title={property.title} location={property.location} neighborhood={(property as any).neighborhood} bedrooms={property.bedrooms_text || property.bedrooms} bathrooms={property.bathrooms_text || property.bathrooms} parking={property.parking_text || property.parking} area={property.area_text || property.area} price={property.price_text || formatCurrency(Number(property.price))} />;
          })}
            </div> : <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum imóvel disponível no momento.</p>
            </div>}

          {/* View All Button */}
          <div className="text-center my-0 py-[10px]">
            <a href="/properties" className="btn-hero inline-block">
              Ver Todos os Imóveis
            </a>
          </div>
        </div>
      </div>
    </section>;
};
export default PropertiesSection;