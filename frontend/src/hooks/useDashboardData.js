import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { useAuth } from "./useAuth";

export function useDashboardData() {
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setFavorites([]);
      setHistory([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    Promise.all([userService.getFavorites(token), userService.getHistory(token)])
      .then(([favoriteResponse, historyResponse]) => {
        if (!isMounted) {
          return;
        }

        setFavorites(favoriteResponse.favorites);
        setHistory(historyResponse.history);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

  return {
    favorites,
    history,
    isLoading,
    setFavorites,
    setHistory,
  };
}
