import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { weatherService } from "../services/weatherService";
import { useDebounce } from "./useDebounce";
import { useAuth } from "./useAuth";

export function useWeatherSearch(defaultCity = "Accra") {
  const { token } = useAuth();
  const [query, setQuery] = useState(defaultCity);
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [error, setError] = useState("");

  const deferredQuery = useDeferredValue(query);
  const debouncedQuery = useDebounce(deferredQuery, 350);

  useEffect(() => {
    searchByCity(defaultCity);
  }, []);

  useEffect(() => {
    if (suppressSuggestions) {
      setSuggestions([]);
      setIsFetchingSuggestions(false);
      setSuppressSuggestions(false);
      return;
    }

    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let isMounted = true;
    setIsFetchingSuggestions(true);

    weatherService
      .getSuggestions(debouncedQuery)
      .then((response) => {
        if (isMounted) {
          startTransition(() => {
            setSuggestions(response.suggestions);
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setSuggestions([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsFetchingSuggestions(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, suppressSuggestions]);

  async function searchByCity(cityName) {
    setIsLoading(true);
    setError("");
    setSuggestions([]);
    setIsFetchingSuggestions(false);
    setSuppressSuggestions(true);

    try {
      const response = await weatherService.getWeather(cityName, token);
      setWeather(response);
      setQuery(response.location.city);
      setSuggestions([]);
    } catch (searchError) {
      setError(searchError.response?.data?.message || "Unable to fetch weather right now.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    query,
    setQuery,
    weather,
    suggestions,
    isLoading,
    isFetchingSuggestions,
    error,
    searchByCity,
  };
}
