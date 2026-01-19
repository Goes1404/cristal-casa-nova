import { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { formatCurrencyShort } from '@/lib/formatCurrency';
import { Badge } from '@/components/ui/badge';

interface PropertyFiltersProps {
  locations: string[];
  onFiltersChange: (filters: FilterValues) => void;
  minPrice: number;
  maxPrice: number;
}

export interface FilterValues {
  location: string;
  priceRange: [number, number];
  type: string;
  status: string;
  searchId: string;
}

const PROPERTY_TYPES = [
  { value: '', label: 'Todos os Tipos' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
];

const PROPERTY_STATUS = [
  { value: '', label: 'Todos os Status' },
  { value: 'disponivel', label: 'Disponível' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'alugado', label: 'Alugado' },
];

const PropertyFilters = ({ locations, onFiltersChange, minPrice, maxPrice }: PropertyFiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    location: '',
    priceRange: [minPrice, maxPrice],
    type: '',
    status: '',
    searchId: '',
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return filters.location !== '' ||
      filters.type !== '' ||
      filters.status !== '' ||
      filters.searchId !== '' ||
      filters.priceRange[0] !== minPrice ||
      filters.priceRange[1] !== maxPrice;
  }, [filters, minPrice, maxPrice]);

  const clearFilters = () => {
    const defaultFilters: FilterValues = {
      location: '',
      priceRange: [minPrice, maxPrice],
      type: '',
      status: '',
      searchId: '',
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const uniqueLocations = useMemo(() => {
    const unique = [...new Set(locations)].filter(Boolean).sort();
    return unique;
  }, [locations]);

  return (
    <div className="bg-card rounded-xl shadow-md p-4 md:p-6 mb-8 border border-border">
      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
              Ativos
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filters Grid */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Search by ID */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por ID..."
              value={filters.searchId}
              onChange={(e) => handleFilterChange('searchId', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Location Select */}
          <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Localização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as Localizações</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Select */}
          <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Select */}
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters Button (Desktop) */}
          <div className="hidden md:flex items-center">
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full gap-2">
                <X className="w-4 h-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Faixa de Preço</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrencyShort(filters.priceRange[0])} - {formatCurrencyShort(filters.priceRange[1])}
            </span>
          </div>
          <Slider
            min={minPrice}
            max={maxPrice}
            step={50000}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{formatCurrencyShort(minPrice)}</span>
            <span>{formatCurrencyShort(maxPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
