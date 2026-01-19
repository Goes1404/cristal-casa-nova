import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters, { FilterValues } from '@/components/PropertyFilters';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';

const Properties = () => {
  const [filters, setFilters] = useState<FilterValues>({
    location: 'all',
    priceRange: [0, 50000000],
    type: 'all',
    status: 'all',
    searchId: '',
  });

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

  // Calculate min/max prices from data
  const { minPrice, maxPrice, locations } = useMemo(() => {
    if (!properties || properties.length === 0) {
      return { minPrice: 0, maxPrice: 50000000, locations: [] };
    }

    const prices = properties.map(p => Number(p.price)).filter(p => p > 0);
    const locs = properties.map(p => p.location).filter(Boolean);
    
    return {
      minPrice: Math.min(...prices, 0),
      maxPrice: Math.max(...prices, 50000000),
      locations: locs
    };
  }, [properties]);

  // Update filters when price range data changes
  useMemo(() => {
    if (filters.priceRange[0] === 0 && filters.priceRange[1] === 50000000 && maxPrice !== 50000000) {
      setFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
    }
  }, [minPrice, maxPrice]);

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter(property => {
      // Filter by search ID
      if (filters.searchId && !property.id.toLowerCase().includes(filters.searchId.toLowerCase())) {
        return false;
      }

      // Filter by location
      if (filters.location !== 'all' && property.location !== filters.location) {
        return false;
      }

      // Filter by type
      if (filters.type !== 'all' && property.type !== filters.type) {
        return false;
      }

      // Filter by status
      if (filters.status !== 'all' && property.status !== filters.status) {
        return false;
      }

      // Filter by price range
      const price = Number(property.price);
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-muted to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="heading-section">Todos os Imóveis</h1>
                <p className="text-lead max-w-2xl mx-auto">
                  Explore nossa seleção completa de imóveis e encontre o lugar perfeito para você.
                </p>
              </div>

              {/* Filters */}
              <PropertyFilters
                locations={locations}
                onFiltersChange={handleFiltersChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredProperties && filteredProperties.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.map((property) => {
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
                          price={formatCurrency(Number(property.price))}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-xl">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Nenhum imóvel encontrado com esses critérios
                  </h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros para ver mais resultados.
                  </p>
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
