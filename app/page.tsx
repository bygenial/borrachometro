'use client';
import { useEffect, useState } from 'react';

// Frases proverbios sobre beber
const frases = [
  // ... lista completa de frases ...
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

  const [phrase, setPhrase] = useState("");
  const [counts, setCounts] = useState<Record<(typeof types)[number], number>>({
    cerveza: 0,
    copa: 0,
    refresco: 0,
  });
  useEffect(() => {
    const savedCounts = localStorage.getItem('borrachometro_counts');
    const savedPrices = localStorage.getItem('borrachometro_prices');
    if (savedCounts) setCounts(JSON.parse(savedCounts));
    if (savedPrices) setPriceInputs(JSON.parse(savedPrices));
    const idx = Math.floor(Math.random() * frases.length);
    setPhrase(frases[idx]);
  }, []);

  useEffect(() => {
    localStorage.setItem('borrachometro_counts', JSON.stringify(counts));
  }, [counts]);

  useEffect(() => {
    localStorage.setItem('borrachometro_prices', JSON.stringify(priceInputs));
  }, [priceInputs]);
  
  // Estados para contar y precios
  const [counts, setCounts] = useState<Record<typeof types[number], number>>({ cerveza:0, copa:0, refresco:0, vino:0 });
  const [priceInputs, setPriceInputs] = useState<Record<typeof types[number], string>>({ cerveza:'', copa:'', refresco:'', vino:'' });
  const [phrase, setPhrase] = useState('');
 80dd9f0 (Añadir opción de vino con emoji y persistencia)

  // Al montar, cargar datos guardados en localStorage
  useEffect(() => {
    const savedCounts = localStorage.getItem('borrachometro_counts');
    const savedPrices = localStorage.getItem('borrachometro_prices');
    if (savedCounts) setCounts(JSON.parse(savedCounts));
    if (savedPrices) setPriceInputs(JSON.parse(savedPrices));
    const idx = Math.floor(Math.random() * frases.length);
    setPhrase(frases[idx]);
  }, []);

  // Guardar counts en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('borrachometro_counts', JSON.stringify(counts));
  }, [counts]);

  // Guardar prices en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('borrachometro_prices', JSON.stringify(priceInputs));
  }, [priceInputs]);

  // Funciones para modificar estado
  const increment = (t: typeof types[number]) =>
    setCounts(prev => ({ ...prev, [t]: prev[t] + 1 }));

  const decrement = (t: typeof types[number]) =>
    setCounts(prev => ({ ...prev, [t]: Math.max(0, prev[t] - 1) }));

  const handlePriceChange = (t: typeof types[number], value: string) => {
    if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setPriceInputs(prev => ({ ...prev, [t]: value }));
    }
  };

  const resetAll = () => {
    setCounts({ cerveza:0, copa:0, refresco:0, vino:0 });
    setPriceInputs({ cerveza:'', copa:'', refresco:'', vino:'' });
    localStorage.removeItem('borrachometro_counts');
    localStorage.removeItem('borrachometro_prices');
  };

  // Cálculos
  const totalPrice = types.reduce((sum, t) => {
    const raw = priceInputs[t].replace(',', '.');
    const num = parseFloat(raw) || 0;
    return sum + counts[t] * num;
  }, 0);

  const phraseConsumption = (() => {
    if (types.every(t => counts[t] === 0)) return 'No has bebido nada aún, pídete algo, anda.';
    const parts = types.map(t => {
      const c = counts[t];
      if (c === 0) return t === 'refresco' ? 'ningún refresco' : `ninguna ${t}`;
      return `${c} ${t}${c > 1 ? 's' : ''}`;
    });
    return `Te has bebido ${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`;
  })();

  return (
    <div className="min-h-screen p-6">
      {/* header y subtítulo */}
      <h1 className="text-5xl font-modak text-center text-primary mb-2">Borrachómetro</h1>
      <h2 className="text-2xl font-zain text-center text-secondary mb-6">Bebe y bebe, pero que cuente</h2>

      {/* consumiciones */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        {types.map(tipo => {
          const count = counts[tipo];
          const label = count === 0
            ? `${icons[tipo]} ${tipo}`
            : `${icons[tipo]} ${count} ${tipo}${count > 1 ? 's' : ''}`;
          return (
            <div key={tipo} className="flex flex-col items-center bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-semibold capitalize text-secondary mb-4">{label}</h3>
              <div className="flex space-x-4 mb-4">
                <button onClick={() => increment(tipo)} className="px-4 py-2 bg-green-500 text-white rounded active:scale-95 transition-transform">+1</button>
                <button onClick={() => decrement(tipo)} className="px-4 py-2 bg-red-500 text-white rounded active:scale-95 transition-transform">-1</button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Precio:</span>
                <input type="text" inputMode="decimal" placeholder="0,00" value={priceInputs[tipo]} onChange={e => handlePriceChange(tipo, e.target.value)} className="appearance-none w-24 px-2 py-1 border border-gray-300 rounded" />
              </div>
            </div>
          );
        })}
      </div>

      {/* frase aleatoria */}
      <div className="mb-6 text-center italic">{phrase}</div>

      {/* total y reset */}
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
