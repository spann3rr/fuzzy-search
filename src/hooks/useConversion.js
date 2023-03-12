import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const useConversion = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true);
      axios.get(url)
      .then(response => setData(response.data))
      .catch(err => setError(err))
      .finally(() => setIsLoading(false));
  }, [url]);

  return { conversionData: data, error, isLoading };
}

export default useConversion;