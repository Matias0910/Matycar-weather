import React, { useState } from 'react';

function Search({ onSearch }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar ciudad... (Ej: Buenos Aires)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold rounded-lg transition-colors"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}

export default Search;