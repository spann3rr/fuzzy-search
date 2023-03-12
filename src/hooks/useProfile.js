import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const useProfile = (url, user_id) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const groupedData = useMemo(() => {
    if (data) {
      let groupByUserId =  data.reduce((acc, item) => {
        acc[item.user_id] = [...(acc[item.user_id] || []), item];
        return acc;
      }, {});

      return groupByUserId[user_id]
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(true);
      axios.get(url)
      .then(response => setData(response.data))
      .catch(err => setError(err))
      .finally(() => setIsLoading(false));
  }, [url]);

  return { data: groupedData, error, isLoading };
}

export default useProfile;