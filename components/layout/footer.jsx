"use client";

import React from "react";
import {
  PawPrint,
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
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
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>Rua dos Animais, 123<br />São Paulo, SP 01234-567</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>contato@focinhoscarentes.org</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; 2024 Focinhos Carentes. Todos os direitos reservados.</p>
          {/* <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
