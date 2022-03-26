import { City } from '../types';
import FetchSelector, { SelectorProps } from './fetchSelector';

const cityApiProps = {
  getUrl: (query: string) => `/api/city?search=${query.toLowerCase()}`,
  getResult: (json: any) => json.cities,
  stringify: (city: City) => `${city.city} ${city.district} ${city.region}`,
  timeout: 1500,
};

const CitySelector = (props: SelectorProps<City>) =>
  FetchSelector<City>({ ...props, ...cityApiProps });

export default CitySelector;
