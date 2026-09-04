import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What are you looking for?"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-slate-500"
        />

        <button
          type="submit"
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Search
        </button>

      </div>
    </form>
  );
}

export default SearchBar;