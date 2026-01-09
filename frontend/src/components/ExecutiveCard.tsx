import React from 'react';
import { Mail, Linkedin } from 'lucide-react';

// Card réutilisable
const ExecutiveCard = ({ executive }: { executive: { name: string, role: string, image: string, contact: any } }) => (
  <div className="bg-white/90 shadow-md border border-gray-200 rounded-2xl p-6 min-w-[220px] hover:shadow-lg transition-all hover:-translate-y-1 h-80 flex flex-col overflow-hidden">
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-1">{executive.name}</h3>
      <p className="text-gray-600 mb-3">{executive.role}</p>
      <div className="flex flex-col gap-1 text-sm">
        {executive.contact.email && (
          <a href={`mailto:${executive.contact.email}`} className="hover:underline flex items-center gap-1">
            <Mail className="w-4 h-4" /> {executive.contact.email}
          </a>
        )}
        {executive.contact.linkedin && (
          <a href={executive.contact.linkedin} target="_blank" className="hover:underline flex items-center gap-1">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
        )}
      </div>
    </div>
    <img src={executive.image} alt={executive.name} className="w-full flex-1 object-cover rounded-lg" />
  </div>
);

const Divider = () => (
  <div className="my-12 border-t border-gray-300 w-full"></div>
);

export { ExecutiveCard, Divider };
