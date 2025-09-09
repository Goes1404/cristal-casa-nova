import PropertyCard from './PropertyCard';
import apartmentImage from '@/assets/property-apartment.jpg';
import houseImage from '@/assets/property-house.jpg';
import penthouseImage from '@/assets/property-penthouse.jpg';

const PropertiesSection = () => {
  const properties = [
    {
      id: 1,
      image: apartmentImage,
      type: 'Apartamento',
      title: 'Apartamento Luxuoso no Centro',
      location: 'Centro, São Paulo - SP',
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      area: 120,
      price: 'R$ 850.000'
    },
    {
      id: 2,
      image: houseImage,
      type: 'Casa',
      title: 'Casa Moderna em Condomínio',
      location: 'Alphaville, Barueri - SP',
      bedrooms: 4,
      bathrooms: 3,
      parking: 3,
      area: 280,
      price: 'R$ 1.200.000'
    },
    {
      id: 3,
      image: penthouseImage,
      type: 'Cobertura',
      title: 'Penthouse com Vista Panorâmica',
      location: 'Vila Olímpia, São Paulo - SP',
      bedrooms: 5,
      bathrooms: 4,
      parking: 4,
      area: 350,
      price: 'R$ 2.500.000'
    }
  ];

  return (
    <section id="properties" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="heading-section">Nossos Imóveis em Destaque</h2>
            <p className="text-lead max-w-2xl mx-auto">
              Descubra uma seleção cuidadosa dos melhores imóveis disponíveis, 
              com qualidade e localização privilegiada.
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <button className="btn-hero">
              Ver Todos os Imóveis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;