import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';

const propertySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['apartamento', 'casa', 'cobertura', 'terreno', 'comercial']).optional(),
  location: z.string().optional(),
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  parking: z.string().optional(),
  area: z.string().optional()
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  propertyId?: string;
  onSuccess?: () => void;
}

const PropertyForm = ({ propertyId, onSuccess }: PropertyFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema)
  });

  // Load property data if editing
  useEffect(() => {
    const loadPropertyData = async () => {
      if (!propertyId) return;
      
      try {
        const { data: property, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images (
              id,
              image_url,
              is_primary,
              display_order
            )
          `)
          .eq('id', propertyId)
          .single();

        if (error) throw error;

        // Set form values
        setValue('title', property.title || '');
        setValue('description', property.description || '');
        setValue('type', property.type);
        setValue('location', property.location || '');
        setValue('price', property.price?.toString() || '');
        setValue('bedrooms', property.bedrooms?.toString() || '');
        setValue('bathrooms', property.bathrooms?.toString() || '');
        setValue('parking', property.parking?.toString() || '');
        setValue('area', property.area?.toString() || '');

        // Set existing images
        setExistingImages(property.property_images || []);
      } catch (error: any) {
        toast.error('Erro ao carregar imóvel');
      }
    };

    loadPropertyData();
  }, [propertyId, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Imagem removida');
    } catch (error: any) {
      toast.error('Erro ao remover imagem');
    }
  };

  const clearImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Parse values - accept any input, try to convert to number if possible
      const parseNumber = (val: string | undefined) => {
        if (!val) return 0;
        const num = parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'));
        return isNaN(num) ? 0 : num;
      };

      const payload = {
        title: data.title || '',
        description: data.description || null,
        type: data.type || 'apartamento',
        location: data.location || '',
        price: parseNumber(data.price),
        bedrooms: Math.floor(parseNumber(data.bedrooms)),
        bathrooms: Math.floor(parseNumber(data.bathrooms)),
        parking: Math.floor(parseNumber(data.parking)),
        area: parseNumber(data.area),
        user_id: user.id
      };

      let property;

      if (propertyId) {
        // Update existing property
        const { data: updatedProperty, error: propertyError } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', propertyId)
          .select()
          .single();

        if (propertyError) throw propertyError;
        property = updatedProperty;
      } else {
        // Insert new property
        const { data: newProperty, error: propertyError } = await supabase
          .from('properties')
          .insert([payload])
          .select()
          .single();

        if (propertyError) throw propertyError;
        property = newProperty;
      }

      // Upload all images
      const imageUploads = imageFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const imageUrl = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName).data.publicUrl;

        return {
          property_id: property.id,
          image_url: imageUrl,
          is_primary: index === 0,
          display_order: index
        };
      });

      const imageRecords = await Promise.all(imageUploads);

      // Insert all images
      const { error: imageError } = await supabase
        .from('property_images')
        .insert(imageRecords);

      if (imageError) throw imageError;

      const successMessage = propertyId ? 'Imóvel atualizado com sucesso!' : 'Imóvel cadastrado com sucesso!';
      toast.success(successMessage);
      
      if (!propertyId) {
        reset();
        clearImages();
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar imóvel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" {...register('title')} />
        </div>

        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select onValueChange={(value) => setValue('type', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="cobertura">Cobertura</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Localização</Label>
          <Input id="location" {...register('location')} />
        </div>

        <div>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" {...register('price')} />
        </div>

        <div>
          <Label htmlFor="bedrooms">Quartos</Label>
          <Input id="bedrooms" {...register('bedrooms')} />
        </div>

        <div>
          <Label htmlFor="bathrooms">Banheiros</Label>
          <Input id="bathrooms" {...register('bathrooms')} />
        </div>

        <div>
          <Label htmlFor="parking">Vagas</Label>
          <Input id="parking" {...register('parking')} />
        </div>

        <div>
          <Label htmlFor="area">Área (m²)</Label>
          <Input id="area" {...register('area')} />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register('description')} rows={4} />
      </div>

      <div>
        <Label>Fotos do Imóvel (múltiplas)</Label>
        <div className="mt-2 space-y-4">
          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {existingImages.map((image) => (
                <div key={image.id} className="relative">
                  <img src={image.image_url} alt="Imagem" className="w-full h-40 object-cover rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeExistingImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {image.is_primary && (
                    <span className="absolute bottom-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && existingImages.length === 0 && (
                    <span className="absolute bottom-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted hover:bg-muted/50 transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Clique para adicionar fotos</span>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {propertyId ? 'Atualizando...' : 'Cadastrando...'}
          </>
        ) : (
          propertyId ? 'Atualizar Imóvel' : 'Cadastrar Imóvel'
        )}
      </Button>
    </form>
  );
};

export default PropertyForm;
