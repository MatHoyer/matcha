import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';

//eslint-disable-next-line
type ComboboxProps<T extends any[] | any> = {
  name: string;
  list: {
    //eslint-disable-next-line
    value: T extends any[] ? T[number] | null : T | null;
    label: string;
  }[];
  value: T | null;
  onChange: (value: T | null) => void;
  modal?: boolean;
};

// eslint-disable-next-line
export const Combobox = <T extends any>({
  name,
  list,
  value,
  onChange,
  modal,
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? list.find((element) => element.value === value)?.label
            : `Select ${name}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandList>
            <CommandEmpty>No {name} found.</CommandEmpty>
            <CommandGroup>
              {list.map((element) => (
                <CommandItem
                  key={element.value}
                  value={element.value}
                  onSelect={(currentValue) => {
                    onChange(
                      currentValue === value ? null : (currentValue as T)
                    );
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {element.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === element.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// eslint-disable-next-line
export const MultiCombobox = <T extends any[]>({
  name,
  list,
  value,
  onChange,
  modal,
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full flex justify-between"
        >
          <p className="w-[calc(100%-20px)] truncate text-start">
            {value && value.length > 0
              ? value
                  .map(
                    (v) => list.find((element) => element.value === v)?.label
                  )
                  .join(', ')
              : `Select ${name}s...`}
          </p>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}s...`} />
          <CommandList>
            <CommandEmpty>No {name} found.</CommandEmpty>
            <CommandGroup>
              {list.map((element) => (
                <CommandItem
                  key={element.value}
                  value={element.value}
                  onSelect={(currentValue) => {
                    if (value && value.includes(currentValue)) {
                      onChange(
                        value.filter(
                          (v) => v !== (currentValue as T[number])
                        ) as T
                      );
                    } else {
                      onChange(
                        value
                          ? ([...value, currentValue as T[number]] as T)
                          : ([currentValue as T[number]] as T)
                      );
                    }
                  }}
                  className="cursor-pointer"
                >
                  <p className="w-[calc(100%-20px)] truncate text-start">
                    {element.label}
                  </p>
                  <Check
                    className={cn(
                      'ml-auto',
                      value && value.some((v) => v === element.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
