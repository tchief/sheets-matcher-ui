import { useCallback, Dispatch, SetStateAction } from 'react';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { debounce } from 'ts-debounce';

interface Id {
  id: string | number;
}

interface FetchProps<T extends Id> {
  getUrl: (query: string) => string;
  getResult: (json: any) => T[];
  stringify: (t: T) => string;
  timeout: number;
}

export interface SelectorProps<T extends Id> {
  classes?: string;
  placeholder: string;
  selected: T | undefined;
  setSelected: Dispatch<SetStateAction<T | undefined>>;
}

function FetchSelector<T extends Id>(props: FetchProps<T> & SelectorProps<T>) {
  const getAsyncOptions = (query: string) =>
    fetch(props.getUrl(query))
      .then((data) => data.json())
      .then(props.getResult);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadOptions = useCallback(
    debounce((inputText, callback) => getAsyncOptions(inputText), props.timeout),
    []
  );

  return (
    <AsyncSelect
      loadOptions={loadOptions}
      isClearable
      cacheOptions
      defaultOptions
      value={props.selected}
      onChange={(e: SingleValue<T>) => props.setSelected(e)}
      placeholder={props.placeholder}
      className={props.classes}
      getOptionLabel={props.stringify}
    />
  );
}

export default FetchSelector;
