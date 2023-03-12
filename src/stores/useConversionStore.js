import {create} from 'zustand';
import axios from 'axios';
import { ConversionUrl } from '../apis/Urls';

const useConversionStore = create((set, get) => ({
    conversionRate: 1,
    errorMessage: '',
    fetchData: async (currency) => {
      let api_url = `${ConversionUrl}/${currency}`;
      try {
        const response = await axios.get(api_url);
        set({ conversionRate: response.data.conversion_rate, errorMessage: '' });
      } catch (error) {
        set({ errorMessage: error.message });
      }
    },
  }));
  

export default useConversionStore;
