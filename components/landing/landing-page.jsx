"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import {
  PawPrint,
  Menu,
  ChevronDown,
  Search,
  FileText,
  Home,
  HeartHandshake,
  ShieldCheck,
  Star,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Heart,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const featuredAnimals = [
  {
    name: "Bella",
    age: "2 anos",
    breed: "Beagle Mix",
    gender: "Fêmea",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    urgent: true,
  },
  {
    name: "Oliver",
    age: "4 meses",
    breed: "Pelo Curto",
    gender: "Macho",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1143&q=80",
  },
  {
    name: "Max",
    age: "5 anos",
    breed: "Golden Retriever",
    gender: "Macho",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
  },
  {
    name: "Luna",
    age: "1 ano",
    breed: "Siamês Mix",
    gender: "Fêmea",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=715&q=80",
    isNew: true,
  },
];

const testimonials = [
  {
    name: "Sarah Jenkins",
    adoptedPet: "Adotou Buster",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    quote: "Adotar o Buster foi a melhor decisão que já tomamos. O processo foi muito acolhedor, e ele trouxe tanta alegria para nossa casa. Ele não é apenas um pet; é família.",
  },
  {
    name: "Michael Torres",
    adoptedPet: "Adotou Luna",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    quote: "Eu estava nervoso em adotar uma gata idosa, mas a equipe me combinou perfeitamente com a Luna. Ela é a alma mais doce e passamos todas as noites lendo juntos.",
  },
  {
    name: "Emily & David",
    adoptedPet: "Adotaram Rocky",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    quote: "Queríamos um companheiro para trilhas, e Rocky é exatamente isso! O abrigo nos deu todo o histórico médico e dicas de treinamento. Somos muito gratos pela dedicação deles.",
  },
];

export default function LandingPage() {
  const [selectedDonation, setSelectedDonation] = useState(25);

  return (
    <div className="min-h-screen bg-background-50">
      {/* Sticky Header */}
      <header className="fixed w-full z-50 transition-all duration-300 bg-background-50/95 backdrop-blur-sm shadow-sm border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white">
                <PawPrint className="w-6 h-6" />
              </div>
              <span className="font-heading text-2xl font-bold text-neutral-900">Focinhos Carentes</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#animals" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">Adotar</a>
              <a href="#how-it-works" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">Como Funciona</a>
              <a href="#stories" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">Histórias</a>
              <a href="#volunteer" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">Voluntariar</a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <a href="#donate" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-[8px] font-medium transition-all shadow-custom hover:shadow-custom-hover transform hover:-translate-y-0.5">
                Doar Agora
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button className="text-neutral-600 hover:text-neutral-900 p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* <img 
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2086&q=80" 
            alt="Cachorro feliz correndo no campo" 
            className="w-full h-full object-cover"
          /> */}
          <Image 
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2086&q=80" 
            alt="Hero" 
            fill 
            priority 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-900/80 via-neutral-900/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-10">
          <span className="inline-block py-1 px-3 rounded-pill bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium mb-6 animate-fade-in-up">
            Mais de 5.000 Caudas Felizes & Contando
          </span>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-100">
            Dê a Uma Vida uma <br className="hidden md:block" /> <span className="text-primary-300">Segunda Chance</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-100 max-w-2xl mx-auto mb-10 font-light animate-fade-in-up delay-200">
            Todo animal merece um lar amoroso. Junte-se à nossa comunidade de corações compassivos e encontre seu companheiro perfeito hoje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link href="/sign-in">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-[8px] font-semibold text-lg transition-all shadow-custom hover:shadow-custom-hover transform hover:-translate-y-1 w-full sm:w-auto h-auto">
                Adotar Agora
              </Button>
            </Link>
            <a href="#donate" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-[8px] font-semibold text-lg transition-all hover:shadow-lg w-full sm:w-auto inline-flex items-center justify-center">
              Doar Hoje
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* Impact Stats Bar */}
      <section className="bg-white py-12 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            <div className="p-4">
              <p className="text-4xl md:text-5xl font-bold text-primary-500 mb-2 font-heading">12.450+</p>
              <p className="text-neutral-500 font-medium uppercase tracking-wide text-sm">Animais Resgatados</p>
            </div>
            <div className="p-4">
              <p className="text-4xl md:text-5xl font-bold text-secondary-500 mb-2 font-heading">9.800+</p>
              <p className="text-neutral-500 font-medium uppercase tracking-wide text-sm">Famílias Conectadas</p>
            </div>
            <div className="p-4">
              <p className="text-4xl md:text-5xl font-bold text-primary-500 mb-2 font-heading">R$2.5M+</p>
              <p className="text-neutral-500 font-medium uppercase tracking-wide text-sm">Arrecadados para Cuidados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Animals */}
      <section id="animals" className="py-20 md:py-24 bg-background-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Conheça Nossos Amigos</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">Essas almas amorosas estão esperando por um lar para sempre. Você poderia ser o par perfeito?</p>
          </div>

          {/* Mobile: Horizontal Scroll / Desktop: Grid */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar snap-x snap-mandatory">
            {featuredAnimals.map((animal) => (
              <div key={animal.name} className="min-w-[280px] md:min-w-0 bg-white rounded-[12px] shadow-soft hover:shadow-custom-hover transition-all duration-300 transform hover:-translate-y-2 overflow-hidden snap-center group cursor-pointer">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={animal.image} 
                    alt={animal.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {animal.urgent && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-[999px] text-xs font-bold text-primary-600 uppercase tracking-wide shadow-sm">
                      Urgente
                    </div>
                  )}
                  {animal.isNew && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-[999px] text-xs font-bold text-secondary-600 uppercase tracking-wide shadow-sm">
                      Novo
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading text-2xl font-bold text-neutral-900">{animal.name}</h3>
                    <span className="text-neutral-500 text-sm bg-neutral-100 px-2 py-1 rounded-[8px]">{animal.age}</span>
                  </div>
                  <p className="text-neutral-500 mb-4">{animal.breed} • {animal.gender}</p>
                  <button className="w-full bg-background-100 hover:bg-primary-50 text-primary-700 font-medium py-3 rounded-[8px] transition-colors flex items-center justify-center gap-2 group-hover:bg-primary-500 group-hover:text-white">
                    Conhecer {animal.name} <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/sign-in" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Ver Todos os Animais para Adoção <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 mb-4">A Jornada Para Casa</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">Adotar um amigo é mais fácil do que você pensa. Veja como ajudamos você a encontrar seu par perfeito.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-neutral-100 -z-10 transform translate-y-4" />

            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                <Search className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-3">1. Navegue pelos Animais</h3>
              <p className="text-neutral-600 leading-relaxed">Explore nossos perfis para encontrar um pet que combine com seu estilo de vida e personalidade.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-24 h-24 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                <FileText className="w-10 h-10 text-secondary-500" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-3">2. Candidate-se para Adotar</h3>
              <p className="text-neutral-600 leading-relaxed">Preencha um formulário simples para que possamos conhecer você e garantir uma boa combinação.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                <Home className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-3">3. Leve Para Casa</h3>
              <p className="text-neutral-600 leading-relaxed">Conheça seu novo melhor amigo, finalize a adoção e comece sua vida juntos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-20 md:py-24 bg-neutral-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-10">
            <HeartHandshake className="w-12 h-12 text-primary-500 mx-auto mb-6" />
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">Cada Real Salva uma História</h2>
            <p className="text-xl text-neutral-300 font-light italic mb-8">&quot;Por causa de doadores como você, fui resgatado das ruas, curado das minhas feridas e encontrei uma família que me ama.&quot; — Barnaby, resgatado em 2023</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-[12px] p-8 border border-white/10 shadow-2xl">
            <p className="text-neutral-300 mb-6 font-medium">Escolha um valor para doar</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[10, 25, 50].map((amount) => (
                <button 
                  key={amount}
                  onClick={() => setSelectedDonation(amount)}
                  className={`py-4 rounded-[8px] border border-white/20 hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all font-bold text-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${selectedDonation === amount ? 'bg-primary-500 border-primary-500 text-white' : ''}`}
                >
                  R${amount}
                </button>
              ))}
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">R$</span>
                <input 
                  type="number" 
                  placeholder="Outro" 
                  className="w-full py-4 pl-10 pr-4 rounded-[8px] bg-transparent border border-white/20 text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-bold text-lg"
                  onChange={(e) => setSelectedDonation(Number(e.target.value))}
                />
              </div>
            </div>

            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-[8px] text-lg shadow-custom hover:shadow-custom-hover transition-all transform hover:-translate-y-1">
              Doar Agora
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-secondary-500" />
              <span>100% das doações vão diretamente para o cuidado dos animais.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className="py-20 md:py-24 bg-background-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Começos Felizes</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">Histórias reais de famílias que encontraram sua peça que faltava.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white p-8 rounded-[12px] shadow-soft border border-neutral-100">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-neutral-900">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-500">{testimonial.adoptedPet}</p>
                  </div>
                </div>
                <p className="text-neutral-600 italic leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-4 flex text-primary-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Volunteer CTA */}
      <section id="volunteer" className="py-20 bg-gradient-to-br from-primary-100 to-secondary-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl font-bold text-neutral-900 mb-6">Junte-se à Nossa Comunidade de Heróis</h2>
          <p className="text-neutral-700 text-lg mb-10 max-w-2xl mx-auto">Seja voluntariando seu tempo, sendo lar temporário de um animal necessitado, ou se mantendo atualizado com nossa newsletter, você faz a diferença.</p>
          
          <div className="bg-white p-2 rounded-[8px] shadow-lg max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Digite seu endereço de email" 
              className="flex-1 px-4 py-3 rounded-[8px] border-none focus:ring-2 focus:ring-primary-500 outline-none text-neutral-900"
            />
            <button className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-[8px] font-medium transition-colors whitespace-nowrap">
              Receber Novidades
            </button>
          </div>
          
          <div className="mt-8">
            <a href="#" className="text-neutral-600 hover:text-primary-600 font-medium underline decoration-2 underline-offset-4 transition-colors">
              Saiba mais sobre oportunidades de voluntariado
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6 text-white">
                <PawPrint className="w-6 h-6" />
                <span className="font-heading text-xl font-bold">Focinhos Carentes</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Dedicados a resgatar, reabilitar e realocar animais necessitados. Cada vida importa, cada história conta.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Adotar</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition-colors">Cães Disponíveis</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Gatos Disponíveis</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Processo de Adoção</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Taxas de Adoção</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Participe</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition-colors">Doar</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Voluntariar</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Programa de Lar Temporário</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Eventos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>Rua dos Animais, 123<br />São Paulo, SP 01234-567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>(11) 1234-5678</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>contato@focinhoscarentes.org</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; 2024 Focinhos Carentes. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Donation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-neutral-200 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <a href="#donate" className="block w-full bg-primary-500 text-white text-center font-bold py-3 rounded-[8px] shadow-custom">
          Doar Hoje
        </a>
      </div>
    </div>
  );
}
