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
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <input
        type="text"
        placeholder="Buscar ciudad..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-md transition-all text-sm font-semibold"
      />
      <button
        type="submit"
        className="bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-500/20 active:scale-95 text-sm btn-glow"
      >
        🔍
      </button>
    </form>
  );
}

export default Search;