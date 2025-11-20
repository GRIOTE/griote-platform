import React from 'react';

interface AfricanGriotIllustrationProps {
  className?: string;
}

const AfricanGriotIllustration: React.FC<AfricanGriotIllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fond avec motifs africains */}
        <defs>
          <pattern id="africanPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="3" fill="#FFDE59" opacity="0.1"/>
            <path d="M10,10 L30,10 L20,30 Z" fill="#FFDE59" opacity="0.05"/>
          </pattern>
          
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513"/>
            <stop offset="100%" stopColor="#A0522D"/>
          </linearGradient>
          
          <linearGradient id="clothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35"/>
            <stop offset="50%" stopColor="#F7931E"/>
            <stop offset="100%" stopColor="#FFDE59"/>
          </linearGradient>
        </defs>
        
        {/* Arrière-plan avec motifs */}
        <rect width="400" height="400" fill="url(#africanPattern)"/>
        
        {/* Cercle décoratif arrière */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="#FFDE59" strokeWidth="2" opacity="0.3"/>
        <circle cx="200" cy="200" r="150" fill="none" stroke="#FFDE59" strokeWidth="1" opacity="0.2"/>
        
        {/* Corps du griot */}
        <ellipse cx="200" cy="320" rx="80" ry="60" fill="url(#clothGradient)"/>
        
        {/* Bras gauche */}
        <ellipse cx="140" cy="280" rx="25" ry="50" fill="url(#skinGradient)" transform="rotate(-20 140 280)"/>
        
        {/* Bras droit */}
        <ellipse cx="260" cy="280" rx="25" ry="50" fill="url(#skinGradient)" transform="rotate(20 260 280)"/>
        
        {/* Tête */}
        <circle cx="200" cy="180" r="50" fill="url(#skinGradient)"/>
        
        {/* Cheveux/Coiffe traditionnelle */}
        <path d="M150,160 Q200,120 250,160 Q240,140 200,130 Q160,140 150,160" fill="#2C1810"/>
        
        {/* Yeux */}
        <ellipse cx="185" cy="175" rx="8" ry="6" fill="white"/>
        <ellipse cx="215" cy="175" rx="8" ry="6" fill="white"/>
        <circle cx="185" cy="175" r="4" fill="black"/>
        <circle cx="215" cy="175" r="4" fill="black"/>
        
        {/* Nez */}
        <ellipse cx="200" cy="185" rx="4" ry="8" fill="#7A3F0F"/>
        
        {/* Bouche souriante */}
        <path d="M190,195 Q200,205 210,195" stroke="#2C1810" strokeWidth="3" fill="none"/>
        
        {/* Instrument traditionnel (kora ou djembé) */}
        <ellipse cx="140" cy="250" rx="20" ry="35" fill="#8B4513"/>
        <ellipse cx="140" cy="235" rx="18" ry="8" fill="#D2691E"/>
        <path d="M125,235 L155,235" stroke="#654321" strokeWidth="2"/>
        <path d="M130,240 L150,240" stroke="#654321" strokeWidth="1"/>
        
        {/* Main droite gesticulant */}
        <circle cx="260" cy="250" r="12" fill="url(#skinGradient)"/>
        
        {/* Symboles de parole/sagesse autour */}
        <g opacity="0.6">
          <path d="M300,150 Q310,140 320,150 Q310,160 300,150" fill="#FFDE59"/>
          <path d="M320,180 Q330,170 340,180 Q330,190 320,180" fill="#FFDE59"/>
          <path d="M310,210 Q320,200 330,210 Q320,220 310,210" fill="#FFDE59"/>
        </g>
        
        {/* Motifs décoratifs sur les vêtements */}
        <g opacity="0.8">
          <circle cx="180" cy="310" r="4" fill="#FF6B35"/>
          <circle cx="220" cy="315" r="4" fill="#FF6B35"/>
          <circle cx="200" cy="330" r="3" fill="#FF6B35"/>
          <path d="M170,320 L190,320 L180,335 Z" fill="#F7931E"/>
          <path d="M210,325 L230,325 L220,340 Z" fill="#F7931E"/>
        </g>
        
        {/* Aura de sagesse */}
        <circle cx="200" cy="180" r="70" fill="none" stroke="#FFDE59" strokeWidth="1" opacity="0.3" strokeDasharray="5,5"/>
        
        {/* Symboles Adinkra subtils en arrière-plan */}
        <g opacity="0.1">
          <path d="M80,80 L120,80 L100,120 Z" fill="#FFDE59"/>
          <circle cx="320" cy="100" r="15" fill="none" stroke="#FFDE59" strokeWidth="2"/>
          <path d="M60,300 Q80,280 100,300 Q80,320 60,300" fill="#FFDE59"/>
        </g>
      </svg>
      
      {/* Texte décoratif */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-griote-accent text-sm font-medium opacity-80">
          "La parole est sacrée"
        </p>
        <p className="text-griote-white/60 text-xs">
          Sagesse africaine
        </p>
      </div>
    </div>
  );
};

export default AfricanGriotIllustration;
