// app/page.tsx
'use client';
import { useEffect, useState } from 'react';

// Frases proverbios sobre beber
const frases = [
  'A buen vino, no hay buen tino.',
  'A buen vino, no hay mal bebedor.',
  'A la carne, vino; y si es jamón, con más razón.',
  'A mala cama, colchón de vino.',
  'A mucho vino, no hay cabeza.',
  'A quien bebe, hablar no se debe.',
  'Aceite y vino, bálsamo divino.',
  'Agua de cepas y orinal te pondrán en el hospital.',
  'Al hombre viejo, vino nuevo.',
  'Amigo y vino, el más antiguo.',
  'Andar derecho y mucho beber, no puede ser.',
  'Baco, Venus y el tabaco, ponen al hombre flaco.',
  'Bebe cada día vino añejo y me agradecerás el consejo.',
  'Bebe el agua a chorros, y el vino a sorbos.',
  'Bebe vino cada día, pero nunca en demasía.',
  'Bebe, que te rías del vino, pero déjalo antes de que se ría de ti el vino.',
  'Beber buen vino no es desatino; lo que es malo es beber vino malo.',
  'Beber con medida alarga la vida.',
  'Beber hasta caer es de reprender; beber hasta tambalear tampoco es de aprobar; unos traguitos de cuanto en cuanto y vamos andando.',
  'Beber para comer; y aún eso, sin exceso.',
  'Bebido con buenos amigos, sabe bien cualquier vino.',
  'Buen vino y buen pan, ellos se pregonarán.',
  'Buen vino y sopas hervidas le alargan al viejo la vida.',
  'Buen vino cría buena sangre.',
  'Bebe vino de Jerez y tendrás buena vejez.',
  'Vino y verdad no pueden juntos estar.',
  'Yo te perdono el mal que me haces por lo bien que me sabes.'
];

export default function HomePage() {
  const types = ['cerveza', 'copa', 'refresco', 'vino'] as const;
  const icons: Record<typeof types[number], string> = {
    cerveza: '🍺',
    copa:    '🍸',
    refresco:'🥤',
    vino:    '🍷',
  };

  // Estados y persistencia
  const [counts, setCounts] = useState<Record<typeof types[number], number>>({ cerveza: 0, copa: 0, refresco: 0, vino: 0 });
  const [priceInputs, setPriceInputs] = useState<Record<typeof types[number], string>>({ cerveza: '', copa: '', refresco: '', vino: '' });
  const [phrase, setPhrase] = useState('');

  // Cargar datos previos y frase
  useEffect(() => {
    const idx = Math.floor(Math.random() * frases.length);
    setPhrase(frases[idx]);
    const savedCounts = localStorage.getItem('borrachometro_counts');
    const savedPrices = localStorage.getItem('borrachometro_prices');
    if (savedCounts) setCounts(JSON.parse(savedCounts));
    if (savedPrices) setPriceInputs(JSON.parse(savedPrices));
  }, []);

  // Guardar cambios
  useEffect(() => { localStorage.setItem('borrachometro_counts', JSON.stringify(counts)); }, [counts]);
  useEffect(() => { localStorage.setItem('borrachometro_prices', JSON.stringify(priceInputs)); }, [priceInputs]);

  // Modificadores
  const increment = (t: typeof types[number]) => setCounts(p => ({ ...p, [t]: p[t] + 1 }));
  const decrement = (t: typeof types[number]) => setCounts(p => ({ ...p, [t]: Math.max(0, p[t] - 1) }));
  const handlePriceChange = (t: typeof types[number], v: string) => {
    if (v === '' || /^[0-9]*[.,]?[0-9]*$/.test(v)) setPriceInputs(p => ({ ...p, [t]: v }));
  };
  const resetAll = () => {
    setCounts({ cerveza: 0, copa: 0, refresco: 0, vino: 0 });
    setPriceInputs({ cerveza: '', copa: '', refresco: '', vino: '' });
    localStorage.removeItem('borrachometro_counts');
    localStorage.removeItem('borrachometro_prices');
  };

  // Cálculos
  const totalPrice = types.reduce((s, t) => {
    const num = parseFloat(priceInputs[t].replace(',', '.')) || 0;
    return s + counts[t] * num;
  }, 0);
  const phraseConsumption = (() => {
  // Filtrar solo tipos con cantidad > 0
  const consumedTypes = types.filter(t => counts[t] > 0);
  if (consumedTypes.length === 0) {
    return 'No has bebido nada aún, pídete algo, anda.';
  }
  // Construir partes según bebidas consumidas
  const parts = consumedTypes.map(t => {
    const c = counts[t];
    const label = `${c} ${t}${c > 1 ? 's' : ''}`;
    return label;
  });
  if (parts.length === 1) {
    return `Te has bebido ${parts[0]}`;
  }
  if (parts.length === 2) {
    return `Te has bebido ${parts[0]} y ${parts[1]}`;
  }
  // Más de dos tipos
  return `Te has bebido ${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`;
})();
      }).join(', ').replace(/, ([^,]*)$/, ' y $1')}`;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-5xl font-modak text-center text-primary mb-2">Borrachómetro</h1>
      <h2 className="text-2xl font-zain text-center text-secondary mb-6">Bebe y bebe, pero que cuente</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        {types.map(tipo => (
          <div key={tipo} className="flex flex-col items-center bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-semibold capitalize text-secondary mb-4">
              {counts[tipo] === 0 ? `${icons[tipo]} ${tipo}` : `${icons[tipo]} ${counts[tipo]} ${tipo}${counts[tipo] > 1 ? 's' : ''}`}
            </h3>
            <div className="flex space-x-4 mb-4">
              <button onClick={() => increment(tipo)} className="px-4 py-2 bg-green-500 text-white rounded active:scale-95 transition-transform">+1</button>
              <button onClick={() => decrement(tipo)} className="px-4 py-2 bg-red-500 text-white rounded active:scale-95 transition-transform">-1</button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Precio:</span>
              <input type="text" inputMode="decimal" placeholder="0,00" value={priceInputs[tipo]} onChange={e => handlePriceChange(tipo, e.target.value)} className="appearance-none w-24 px-2 py-1 border border-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="mb-6 text-center italic">{phrase}</div>
      <div className="bg-white p-6 rounded-lg shadow font-zain text-center mb-6">
        <p className="text-4xl font-bold mb-4">TOTAL</p>
        <p className="mb-2 text-lg">{phraseConsumption}</p>
        <p className="text-2xl font-medium">€{totalPrice.toFixed(2).replace('.', ',')}</p>
      </div>
      <div className="flex justify-center">
        <button onClick={resetAll} className="px-4 py-2 bg-accent text-white rounded hover:bg-secondary active:scale-95 transition-transform">Reset</button>
      </div>
      <footer className="mt-6 text-center text-sm text-gray-500">© Santi Capuz</footer>
    </div>
  );
}
