import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const useCurrency = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      setIsLoading(true);
      axios.get(url)
        .then(response => {
          const currencyData = Object.entries(response.data).map(([code, { symbol_native }]) => ({ code, symbol_native }));
          setData(currencyData);
        })
        .catch(err => setError(err))
        .finally(() => setIsLoading(false));
    }, [url]);
  
    return { currencyData: data, error, isLoading };
  }
  
  export default useCurrency;
  