import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard from '@/components/PropertyCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

const Properties = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['all-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            image_url,
            is_primary,
            display_order
          )
        `)
        .eq('status', 'disponivel')
        .order('created_at', { ascending: false });

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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-muted to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="heading-section">Todos os Imóveis Disponíveis</h1>
                <p className="text-lead max-w-2xl mx-auto">
                  Explore nossa seleção completa de imóveis e encontre o lugar perfeito para você.
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : properties && properties.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.map((property) => {
                    const sortedImages = [...property.property_images]
                      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                      .map(img => img.image_url);
                    
                    return (
                      <PropertyCard
                        key={property.id}
                        id={property.id}
                        images={sortedImages}
                        type={typeMap[property.type] || property.type}
                        title={property.title}
                        location={property.location}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        parking={property.parking}
                        area={property.area}
                        price={`R$ ${Number(property.price).toLocaleString('pt-BR')}`}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum imóvel disponível no momento.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
