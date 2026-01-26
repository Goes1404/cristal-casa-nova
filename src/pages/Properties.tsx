import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters, { FilterValues } from '@/components/PropertyFilters';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, SearchX } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { Button } from '@/components/ui/button';

const Properties = () => {
  const [filters, setFilters] = useState<FilterValues>({
    location: 'all',
    priceRange: [0, 50000000],
    type: 'all',
    status: 'all',
    searchTerm: '',
    bedrooms: 'all',
    parking: 'all',
    areaRange: [0, 1000],
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

  // Calculate dynamic min/max from data
  const { minPrice, maxPrice, minArea, maxArea, locations } = useMemo(() => {
    if (!properties || properties.length === 0) {
      return { minPrice: 0, maxPrice: 50000000, minArea: 0, maxArea: 1000, locations: [] };
    }

    const prices = properties.map(p => Number(p.price)).filter(p => p > 0);
    const areas = properties.map(p => Number(p.area)).filter(a => a > 0);
    const locs = properties.map(p => p.location).filter(Boolean);
    
    return {
      minPrice: Math.min(...prices, 0),
      maxPrice: Math.max(...prices, 50000000),
      minArea: Math.min(...areas, 0),
      maxArea: Math.max(...areas, 1000),
      locations: locs
    };
  }, [properties]);

  // Update filters when dynamic ranges change (only on initial load)
  useEffect(() => {
    if (properties && properties.length > 0) {
      setFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice],
        areaRange: [minArea, maxArea],
      }));
    }
  }, [minPrice, maxPrice, minArea, maxArea, properties]);

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter(property => {
      // Filter by search term (ID or title)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesId = property.id.toLowerCase().includes(searchLower);
        const matchesTitle = property.title.toLowerCase().includes(searchLower);
        if (!matchesId && !matchesTitle) {
          return false;
        }
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

      // Filter by bedrooms
      if (filters.bedrooms !== 'all') {
        const beds = Number(property.bedrooms);
        if (filters.bedrooms === '4+') {
          if (beds < 4) return false;
        } else {
          if (beds !== parseInt(filters.bedrooms)) return false;
        }
      }

      // Filter by parking
      if (filters.parking !== 'all') {
        const park = Number(property.parking);
        if (filters.parking === '3+') {
          if (park < 3) return false;
        } else {
          if (park !== parseInt(filters.parking)) return false;
        }
      }

      // Filter by price range
      const price = Number(property.price);
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Filter by area range
      const area = Number(property.area);
      if (area < filters.areaRange[0] || area > filters.areaRange[1]) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      location: 'all',
      priceRange: [minPrice, maxPrice],
      type: 'all',
      status: 'all',
      searchTerm: '',
      bedrooms: 'all',
      parking: 'all',
      areaRange: [minArea, maxArea],
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-muted to-background">
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
                minArea={minArea}
                maxArea={maxArea}
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
                            bedrooms={property.bedrooms_text || property.bedrooms}
                            bathrooms={property.bathrooms_text || property.bathrooms}
                            parking={property.parking_text || property.parking}
                            area={property.area_text || property.area}
                            price={property.price_text || formatCurrency(Number(property.price))}
                          />
                        );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl border border-border shadow-sm">
                  <SearchX className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Não encontramos imóveis com esses critérios
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar os filtros para ver mais resultados.
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Limpar Filtros
                  </Button>
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
