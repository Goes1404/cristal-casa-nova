import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };
  const contactInfo = [{
    icon: Phone,
    title: 'Telefone',
    info: '(11) 99618-8216',
    link: 'tel: 5511996188216'
  }, {
    icon: MessageCircle,
    title: 'WhatsApp',
    info: '(11) 99618-8216',
    link: 'https://wa.me/5511996188216'
  }, {
    icon: Mail,
    title: 'E-mail',
    info: 'sq1brunaleite@gmail.com.br',
    link: 'mailto:sq1brunaleite@gmail.com.br'
  }, {
    icon: MapPin,
    title: 'Endereço',
    info: 'Calçada Antares, 264, Segundo Andar, Alphaville, Santana de Parnaíba, SP, Brasil',
    link: '#'
  }];
  return <section id="contact" className="py-20 bg-gradient-to-b from-muted to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="heading-section">Fale Conosco</h2>
            <p className="text-lead max-w-2xl mx-auto">
              Pronto para encontrar seu imóvel ideal? Entre em contato conosco 
              e transforme seu sonho em realidade.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold text-primary mb-8">
                Entre em Contato
              </h3>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-1">{item.title}</h4>
                        <a href={item.link} className="text-crystal-gray hover:text-accent transition-colors">
                          {item.info}
                        </a>
                      </div>
                    </div>;
              })}
              </div>

              <div className="bg-gradient-card rounded-xl p-6 shadow-soft">
                <h4 className="font-bold text-primary mb-3">Horário de Atendimento</h4>
                <div className="space-y-2 text-crystal-gray">
                  <div className="flex justify-between">
                    <span>Segunda à Sexta:</span>
                    <span>08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span>09:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span>Horario marcado.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="card-crystal">
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Envie sua Mensagem
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-crystal-gray font-medium mb-2">
                      Nome Completo
                    </label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors" placeholder="Seu nome completo" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-crystal-gray font-medium mb-2">
                      E-mail
                    </label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors" placeholder="seu@email.com" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-crystal-gray font-medium mb-2">
                      Telefone
                    </label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors" placeholder="(11) 99999-9999" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-crystal-gray font-medium mb-2">
                      Mensagem
                    </label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none" placeholder="Como podemos ajudar você?" />
                  </div>

                  <button type="submit" className="w-full btn-hero justify-center">
                    <Send className="w-5 h-5" />
                    <span>Enviar Mensagem</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;