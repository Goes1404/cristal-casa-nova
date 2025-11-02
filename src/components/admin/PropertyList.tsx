import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const PropertyList = () => {
  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            image_url,
            is_primary
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      toast.success('Imóvel excluído com sucesso!');
      refetch();
    } catch (error: any) {
      toast.error('Erro ao excluir imóvel');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum imóvel cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {properties.map((property) => {
        const primaryImage = property.property_images.find(img => img.is_primary)?.image_url;
        
        return (
          <div key={property.id} className="flex gap-4 p-4 border border-border rounded-lg">
            {primaryImage && (
              <img
                src={primaryImage}
                alt={property.title}
                className="w-32 h-32 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{property.title}</h3>
              <p className="text-muted-foreground">{property.location}</p>
              <p className="text-primary font-bold mt-2">
                R$ {Number(property.price).toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {property.bedrooms} quartos • {property.bathrooms} banheiros • {property.parking} vagas • {property.area}m²
              </p>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(property.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyList;
