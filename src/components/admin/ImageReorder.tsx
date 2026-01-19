import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GripVertical, Star, X, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageItem {
  id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number | null;
}

interface ImageReorderProps {
  images: ImageItem[];
  onReorder: (images: ImageItem[]) => void;
  onRemove: (imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
}

const ImageReorder = ({ images, onReorder, onRemove, onSetPrimary }: ImageReorderProps) => {
  const [orderedImages, setOrderedImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    // Sort images by display_order
    const sorted = [...images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    setOrderedImages(sorted);
  }, [images]);

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= orderedImages.length) return;

    const newImages = [...orderedImages];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    // Update display_order for all images
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx,
      is_primary: idx === 0 // First image is always primary
    }));

    setOrderedImages(reorderedImages);
    onReorder(reorderedImages);
  };

  const handleSetPrimary = (imageId: string) => {
    const imageIndex = orderedImages.findIndex(img => img.id === imageId);
    if (imageIndex <= 0) return; // Already first or not found

    // Move the selected image to the first position
    const newImages = [...orderedImages];
    const [selectedImage] = newImages.splice(imageIndex, 1);
    newImages.unshift(selectedImage);

    // Update display_order and is_primary for all images
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      display_order: idx,
      is_primary: idx === 0
    }));

    setOrderedImages(reorderedImages);
    onReorder(reorderedImages);
    onSetPrimary(imageId);
  };

  if (orderedImages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
        <p>Nenhuma imagem adicionada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-2">
        Arraste ou use os botões para reordenar. A primeira imagem será a capa.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orderedImages.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "relative group rounded-lg overflow-hidden border-2 transition-all",
              index === 0 ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
            )}
          >
            <div className="aspect-[4/3] relative">
              <img
                src={image.image_url}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move Up */}
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>

                {/* Move Down */}
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === orderedImages.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {/* Set as Primary */}
                {index !== 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => handleSetPrimary(image.id)}
                    title="Definir como capa"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}

                {/* Remove */}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => onRemove(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Capa
                </div>
              )}

              {/* Order Number */}
              <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-xs font-medium">
                {index + 1} / {orderedImages.length}
              </div>
            </div>

            {/* Drag Handle */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-background/80 rounded p-1 cursor-move">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageReorder;
