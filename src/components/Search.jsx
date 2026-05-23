import React, { useState } from "react";

function Search({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="text"
        placeholder="Buscá una ciudad (ej: Buenos Aires, Madrid)..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-sm transition text-sm sm:text-base font-medium"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl transition duration-300 shadow-md active:scale-95 text-sm sm:text-base"
      >
        🔍 Buscar
      </button>
    </form>
  );
}

export default Search;