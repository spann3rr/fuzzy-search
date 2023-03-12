import { create } from 'zustand';

const useCurrencyStore = create((set) => ({
  cur_symbol: '$',
  currency: 'USD',
  setCurrency: (currency) => set(() => {return {currency}}),
  setCurrencySymbol: (cur_symbol) => set(() => {return {cur_symbol}})
}));

export default useCurrencyStore;