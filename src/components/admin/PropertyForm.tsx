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
import { Loader2, Upload, X, Star, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ImageItem {
  id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number | null;
}

interface PropertyFormProps {
  propertyId?: string;
  onSuccess?: () => void;
}

const PropertyForm = ({ propertyId, onSuccess }: PropertyFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ImageItem[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);

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

        // Set existing images sorted by display_order
        const sortedImages = [...(property.property_images || [])]
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        setExistingImages(sortedImages);
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

  const moveExistingImage = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= existingImages.length) return;

    const newImages = [...existingImages];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    // Update display_order for all images
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx,
      is_primary: idx === 0
    }));

    setExistingImages(reorderedImages);
    
    // Save to database
    setSavingOrder(true);
    try {
      for (const img of reorderedImages) {
        await supabase
          .from('property_images')
          .update({ display_order: img.display_order, is_primary: img.is_primary })
          .eq('id', img.id);
      }
      toast.success('Ordem atualizada');
    } catch (error) {
      toast.error('Erro ao salvar ordem');
    } finally {
      setSavingOrder(false);
    }
  };

  const setAsPrimary = async (imageId: string) => {
    const imageIndex = existingImages.findIndex(img => img.id === imageId);
    if (imageIndex <= 0) return;

    const newImages = [...existingImages];
    const [selectedImage] = newImages.splice(imageIndex, 1);
    newImages.unshift(selectedImage);

    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx,
      is_primary: idx === 0
    }));

    setExistingImages(reorderedImages);

    // Save to database
    setSavingOrder(true);
    try {
      for (const img of reorderedImages) {
        await supabase
          .from('property_images')
          .update({ display_order: img.display_order, is_primary: img.is_primary })
          .eq('id', img.id);
      }
      toast.success('Imagem definida como capa');
    } catch (error) {
      toast.error('Erro ao definir capa');
    } finally {
      setSavingOrder(false);
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

      // Upload all new images
      const startingOrder = existingImages.length;
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
          is_primary: existingImages.length === 0 && index === 0,
          display_order: startingOrder + index
        };
      });

      const imageRecords = await Promise.all(imageUploads);

      // Insert all new images
      if (imageRecords.length > 0) {
        const { error: imageError } = await supabase
          .from('property_images')
          .insert(imageRecords);

        if (imageError) throw imageError;
      }

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
          <Input id="price" type="text" {...register('price')} />
        </div>

        <div>
          <Label htmlFor="bedrooms">Quartos</Label>
          <Input id="bedrooms" type="text" {...register('bedrooms')} />
        </div>

        <div>
          <Label htmlFor="bathrooms">Banheiros</Label>
          <Input id="bathrooms" type="text" {...register('bathrooms')} />
        </div>

        <div>
          <Label htmlFor="parking">Vagas</Label>
          <Input id="parking" type="text" {...register('parking')} />
        </div>

        <div>
          <Label htmlFor="area">Área (m²)</Label>
          <Input id="area" type="text" {...register('area')} />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register('description')} rows={4} />
      </div>

      <div>
        <Label>Fotos do Imóvel</Label>
        <p className="text-sm text-muted-foreground mb-3">
          {existingImages.length > 0 
            ? 'Reordene as imagens usando os botões. A primeira imagem será a capa.'
            : 'A primeira foto será usada como capa do imóvel.'}
        </p>
        
        <div className="space-y-4">
          {/* Existing Images with Reorder */}
          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className={cn(
                    "relative group rounded-lg overflow-hidden border-2 transition-all aspect-[4/3]",
                    index === 0 ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                  )}
                >
                  <img 
                    src={image.image_url} 
                    alt={`Imagem ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* Controls overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => moveExistingImage(index, 'up')}
                      disabled={index === 0 || savingOrder}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => moveExistingImage(index, 'down')}
                      disabled={index === existingImages.length - 1 || savingOrder}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    {index !== 0 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => setAsPrimary(image.id)}
                        disabled={savingOrder}
                        title="Definir como capa"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => removeExistingImage(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Primary badge */}
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Capa
                    </span>
                  )}
                  
                  {/* Order number */}
                  <span className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-0.5 rounded text-xs">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* New Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-[4/3]">
                  <img 
                    src={preview} 
                    alt={`Nova foto ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg border-2 border-dashed border-primary/50" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && existingImages.length === 0 && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                      Capa
                    </span>
                  )}
                  <span className="absolute bottom-2 left-2 bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs">
                    Nova
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
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
