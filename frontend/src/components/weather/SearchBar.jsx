import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Search } from "lucide-react";

export function SearchBar({
  query,
  onQueryChange,
  onSubmit,
  suggestions,
  onSelectSuggestion,
  isFetchingSuggestions,
  isSearching,
}) {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || suggestions.length === 0) {
      setActiveIndex(-1);
      return;
    }

    if (activeIndex > suggestions.length - 1) {
      setActiveIndex(-1);
    }
  }, [suggestions, isOpen, activeIndex]);

  function handleSelectSuggestion(label) {
    onQueryChange(label);
    onSelectSuggestion(label);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return;
    }

    setIsOpen(false);
    setActiveIndex(-1);
    onSubmit(cleanQuery);
  }

  function handleInputKeyDown(event) {
    if (!isOpen || suggestions.length === 0) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((currentIndex) => (currentIndex + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((currentIndex) =>
        currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1,
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex].label);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  const showSuggestions = isOpen && (suggestions.length > 0 || (query.trim().length >= 2 && !isFetchingSuggestions));

  return (
    <div ref={wrapperRef} className="relative">
      <form
        onSubmit={handleSubmit}
        className="glass-panel rounded-[28px] p-3 shadow-glass"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/30 px-4 py-3 dark:bg-slate-900/40">
            <Search size={18} className="text-slate-500 dark:text-slate-300" />
            <input
              value={query}
              onChange={(event) => {
                onQueryChange(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (query.trim().length >= 2) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search for a city"
              className="w-full border-none bg-transparent p-0 text-base font-medium placeholder:text-slate-400 focus:ring-0"
            />
            {isFetchingSuggestions ? <LoaderCircle size={16} className="animate-spin" /> : null}
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            {isSearching ? "Searching..." : "Get forecast"}
          </button>
        </div>
      </form>

      {showSuggestions ? (
        <div className="glass-panel absolute z-10 mt-3 w-full rounded-3xl p-2">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion.label)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                  activeIndex === index ? "bg-white/30 dark:bg-slate-800/60" : "hover:bg-white/20"
                }`}
              >
                <span className="font-semibold">{suggestion.cityName}</span>
                <span className="text-sm text-slate-500 dark:text-slate-300">{suggestion.country}</span>
              </button>
            ))
          ) : (
            <div className="rounded-2xl px-4 py-3 text-sm text-slate-500 dark:text-slate-300">
              No matching cities found.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
