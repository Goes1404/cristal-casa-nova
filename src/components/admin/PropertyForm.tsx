import { useState } from 'react';
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
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['apartamento', 'casa', 'cobertura', 'terreno', 'comercial']),
  location: z.string().min(3, 'Localização obrigatória'),
  price: z.number().positive('Preço deve ser positivo'),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  parking: z.number().int().nonnegative(),
  area: z.number().positive('Área deve ser positiva')
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PropertyForm = () => {
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema)
  });

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

  const clearImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (imageFiles.length === 0) {
      toast.error('Por favor, adicione pelo menos uma imagem');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Insert property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert([{
          title: data.title,
          description: data.description || null,
          type: data.type,
          location: data.location,
          price: data.price,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          parking: data.parking,
          area: data.area,
          user_id: user.id
        }])
        .select()
        .single();

      if (propertyError) throw propertyError;

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

      toast.success('Imóvel cadastrado com sucesso!');
      reset();
      clearImages();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar imóvel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="type">Tipo *</Label>
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
          {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <Label htmlFor="location">Localização *</Label>
          <Input id="location" {...register('location')} />
          {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
          {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <Label htmlFor="bedrooms">Quartos</Label>
          <Input id="bedrooms" type="number" {...register('bedrooms', { valueAsNumber: true })} defaultValue={0} />
        </div>

        <div>
          <Label htmlFor="bathrooms">Banheiros</Label>
          <Input id="bathrooms" type="number" {...register('bathrooms', { valueAsNumber: true })} defaultValue={0} />
        </div>

        <div>
          <Label htmlFor="parking">Vagas</Label>
          <Input id="parking" type="number" {...register('parking', { valueAsNumber: true })} defaultValue={0} />
        </div>

        <div>
          <Label htmlFor="area">Área (m²) *</Label>
          <Input id="area" type="number" step="0.01" {...register('area', { valueAsNumber: true })} />
          {errors.area && <p className="text-sm text-destructive mt-1">{errors.area.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register('description')} rows={4} />
      </div>

      <div>
        <Label>Fotos do Imóvel * (múltiplas)</Label>
        <div className="mt-2 space-y-4">
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
                  {index === 0 && (
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
            Cadastrando...
          </>
        ) : (
          'Cadastrar Imóvel'
        )}
      </Button>
    </form>
  );
};

export default PropertyForm;
