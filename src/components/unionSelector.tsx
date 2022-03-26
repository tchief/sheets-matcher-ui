import { Select } from '@supabase/ui';
import { Dispatch, SetStateAction } from 'react';

interface Props<T extends string | number | string[]> {
  options: readonly T[];
  mapOptionToLabel: (option: T) => string;
  mapOptionToValue: (option: T) => string;
  selected: T;
  setSelected: Dispatch<SetStateAction<T>>; // | undefined
}

const UnionSelector = <T extends string | number | string[]>(props: Props<T>) => {
  return (
    <Select
      value={props.selected}
      onChange={(e) => props.setSelected(e.target.value as T)}
      className="block"
      autoComplete="off"
    >
      {props.options.map((option) => (
        <Select.Option key={props.mapOptionToValue(option)} value={props.mapOptionToValue(option)}>
          {props.mapOptionToLabel(option)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default UnionSelector;
