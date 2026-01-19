import { useState, useMemo, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Home, Car, Maximize, BedDouble } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { formatCurrencyShort } from '@/lib/formatCurrency';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface PropertyFiltersProps {
  locations: string[];
  onFiltersChange: (filters: FilterValues) => void;
  minPrice: number;
  maxPrice: number;
  minArea?: number;
  maxArea?: number;
}

export interface FilterValues {
  location: string;
  priceRange: [number, number];
  type: string;
  status: string;
  searchTerm: string;
  bedrooms: string;
  parking: string;
  areaRange: [number, number];
}

const PROPERTY_TYPES = [
  { value: 'all', label: 'Todos os Tipos' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
];

const PROPERTY_STATUS = [
  { value: 'all', label: 'Todos' },
  { value: 'disponivel', label: 'Disponível' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'alugado', label: 'Alugado' },
];

const BEDROOM_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4+', label: '4+' },
];

const PARKING_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3+', label: '3+' },
];

const PropertyFilters = ({ 
  locations, 
  onFiltersChange, 
  minPrice, 
  maxPrice,
  minArea = 0,
  maxArea = 1000
}: PropertyFiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    location: 'all',
    priceRange: [minPrice, maxPrice],
    type: 'all',
    status: 'all',
    searchTerm: '',
    bedrooms: 'all',
    parking: 'all',
    areaRange: [minArea, maxArea],
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceInputMin, setPriceInputMin] = useState('');
  const [priceInputMax, setPriceInputMax] = useState('');

  // Update filters when dynamic price/area range changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [minPrice, maxPrice],
      areaRange: [minArea, maxArea],
    }));
  }, [minPrice, maxPrice, minArea, maxArea]);

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

  const handleAreaChange = (value: number[]) => {
    const newFilters = { ...filters, areaRange: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (type === 'min') {
      setPriceInputMin(numericValue);
      const num = parseInt(numericValue) || minPrice;
      handlePriceChange([num, filters.priceRange[1]]);
    } else {
      setPriceInputMax(numericValue);
      const num = parseInt(numericValue) || maxPrice;
      handlePriceChange([filters.priceRange[0], num]);
    }
  };

  const hasActiveFilters = useMemo(() => {
    return filters.location !== 'all' ||
      filters.type !== 'all' ||
      filters.status !== 'all' ||
      filters.searchTerm !== '' ||
      filters.bedrooms !== 'all' ||
      filters.parking !== 'all' ||
      filters.priceRange[0] !== minPrice ||
      filters.priceRange[1] !== maxPrice ||
      filters.areaRange[0] !== minArea ||
      filters.areaRange[1] !== maxArea;
  }, [filters, minPrice, maxPrice, minArea, maxArea]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.location !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.searchTerm !== '') count++;
    if (filters.bedrooms !== 'all') count++;
    if (filters.parking !== 'all') count++;
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) count++;
    if (filters.areaRange[0] !== minArea || filters.areaRange[1] !== maxArea) count++;
    return count;
  }, [filters, minPrice, maxPrice, minArea, maxArea]);

  const clearFilters = () => {
    const defaultFilters: FilterValues = {
      location: 'all',
      priceRange: [minPrice, maxPrice],
      type: 'all',
      status: 'all',
      searchTerm: '',
      bedrooms: 'all',
      parking: 'all',
      areaRange: [minArea, maxArea],
    };
    setFilters(defaultFilters);
    setPriceInputMin('');
    setPriceInputMax('');
    onFiltersChange(defaultFilters);
  };

  const uniqueLocations = useMemo(() => {
    const unique = [...new Set(locations)].filter(Boolean).sort();
    return unique;
  }, [locations]);

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-primary/5 px-4 md:px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Filtrar Imóveis</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro' : 'filtros'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters} 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar Filtros
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden"
            >
              {showMobileFilters ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block p-4 md:p-6 space-y-6`}>
        {/* Row 1: Search and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search by ID or Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </Label>
            <Input
              placeholder="Código ou nome do imóvel..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="h-10"
            />
          </div>

          {/* Location Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Home className="w-4 h-4" />
              Localização
            </Label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Localizações</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Imóvel</Label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="h-10">
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
          </div>
        </div>

        {/* Row 2: Quick Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Status Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="h-10">
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
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <BedDouble className="w-4 h-4" />
              Quartos
            </Label>
            <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Quartos" />
              </SelectTrigger>
              <SelectContent>
                {BEDROOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Parking */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vagas
            </Label>
            <Select value={filters.parking} onValueChange={(value) => handleFilterChange('parking', value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Vagas" />
              </SelectTrigger>
              <SelectContent>
                {PARKING_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area Range Display */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Maximize className="w-4 h-4" />
              Área (m²)
            </Label>
            <div className="h-10 px-3 rounded-md border border-input bg-background flex items-center text-sm text-muted-foreground">
              {filters.areaRange[0]} - {filters.areaRange[1]} m²
            </div>
          </div>
        </div>

        {/* Row 3: Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Range Slider */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Faixa de Preço</Label>
              <span className="text-sm font-semibold text-primary">
                {formatCurrencyShort(filters.priceRange[0])} - {formatCurrencyShort(filters.priceRange[1])}
              </span>
            </div>
            
            <Slider
              min={minPrice}
              max={maxPrice}
              step={10000}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="w-full"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Mínimo</Label>
                <Input
                  type="text"
                  placeholder={formatCurrencyShort(minPrice)}
                  value={priceInputMin}
                  onChange={(e) => handlePriceInputChange('min', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Máximo</Label>
                <Input
                  type="text"
                  placeholder={formatCurrencyShort(maxPrice)}
                  value={priceInputMax}
                  onChange={(e) => handlePriceInputChange('max', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Area Range Slider */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Tamanho (m²)</Label>
              <span className="text-sm font-semibold text-primary">
                {filters.areaRange[0]} - {filters.areaRange[1]} m²
              </span>
            </div>
            
            <Slider
              min={minArea}
              max={maxArea}
              step={10}
              value={filters.areaRange}
              onValueChange={handleAreaChange}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{minArea} m²</span>
              <span>{maxArea} m²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
