'use client';
import { Button } from '@/components/ui/button';
import { useFormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { clamp, cn, exists, formatNumber } from '@/lib/utils';
import { DECIMAL_SEPARATOR, THOUSAND_SEPARATOR } from '@matcha/common';
import { Minus, Plus } from 'lucide-react';
import { ComponentProps, useEffect, useRef, useState } from 'react';

type TFieldState = {
  value: string;
  status: 'Clean' | 'Edit' | 'Error';
  error?: string;
};

type TNumberInputProps = {
  value: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  scale?: number;
} & ComponentProps<'input'>;

const NumberInput: React.FC<TNumberInputProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  scale = 2,
  className,
  ...rest
}) => {
  const [state, setState] = useState<TFieldState>({
    value: '',
    status: 'Clean',
  });

  const decimalKeyPressed = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (exists(value) && typeof value !== 'number') {
      onChange?.(null);
    } else {
      setState({
        value: formatNumber({ value, scale }),
        status: 'Clean',
      });
    }
  }, [value, scale, onChange]);

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }

    if (key === 'ArrowUp') {
      handleIncrement();
    }
    if (key === 'ArrowDown') {
      handleDecrement();
    }

    decimalKeyPressed.current = e.code === 'NumpadDecimal';
  };

  const handleOnChange = (input: HTMLInputElement) => {
    let value = input.value;

    const decimal = DECIMAL_SEPARATOR;
    const incorrectDecimal = decimal === '.' ? ',' : '.';
    if (decimalKeyPressed.current) {
      decimalKeyPressed.current = false;
      const lastIncorrectDecimalIndex = value.lastIndexOf(incorrectDecimal);
      if (lastIncorrectDecimalIndex > -1) {
        // replace the incorrect decimal with the correct one
        // 123.45 => 123,45
        const lastDecimalIndex = value.lastIndexOf(decimal);
        if (lastDecimalIndex < lastIncorrectDecimalIndex) {
          value =
            value.slice(0, lastIncorrectDecimalIndex) +
            decimal +
            value.slice(lastIncorrectDecimalIndex + 1);
          window.requestAnimationFrame(() => {
            input.selectionStart = lastIncorrectDecimalIndex + 1;
            input.selectionEnd = lastIncorrectDecimalIndex + 1;
          });
        }
      }
    }

    const v = value.replace(/[., ]/g, '');
    if (v.match(/^-?[\d]*$/i)) {
      setState({ value: value, status: 'Edit' });
    }
  };

  const handleOnFocus = () => {
    if (state.status === 'Error') {
      setState((p) => ({ ...p, status: 'Edit' }));
    }
    if (value === 0 && inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleOnBlur = onChange
    ? () => {
        if (state.status === 'Edit') {
          if (state.value) {
            const cleanValue = state.value
              .replace(new RegExp(`\\${THOUSAND_SEPARATOR}`, 'g'), '')
              .replace(DECIMAL_SEPARATOR, '.');
            const numericValue = parseFloat(cleanValue);

            if (state.value === '' || isNaN(numericValue)) {
              onChange(null);
            } else {
              const clampedValue = clamp(numericValue, min, max);
              setState({
                value: formatNumber({ value: clampedValue, scale }),
                status: 'Clean',
              });
              onChange(parseFloat(clampedValue.toFixed(scale)));
            }
          } else {
            onChange(min !== -Infinity ? min : null);
          }
        }
      }
    : undefined;

  const handleIncrement = () => {
    const currentValue = value ?? 0;
    const newValue = clamp(currentValue + step, min, max);
    setState({
      value: formatNumber({ value: newValue, scale }),
      status: 'Clean',
    });
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    const currentValue = value ?? 0;
    const newValue = clamp(currentValue - step, min, max);
    setState({
      value: formatNumber({ value: newValue, scale }),
      status: 'Clean',
    });
    onChange?.(newValue);
  };

  const disableDecrement = (value ?? 0) - step < min;
  const disableIncrement = (value ?? 0) + step > max;

  return (
    <div
      className="flex w-full cursor-default items-center gap-2 rounded-md bg-background p-1"
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        {...rest}
        className={cn(
          'text-right aria-[invalid=true]:border-destructive',
          className
        )}
        type="text"
        value={state.value}
        onBlur={handleOnBlur}
        onKeyDown={handleOnKeyDown}
        onFocus={handleOnFocus}
        onChange={(e) => handleOnChange(e.target)}
      />
      <div className="flex gap-1">
        <Button
          type="button"
          variant={'outline'}
          size={'sm-icon'}
          onClick={handleDecrement}
          disabled={disableDecrement}
          className="rounded-full"
        >
          <Minus />
        </Button>
        <Button
          type="button"
          variant={'outline'}
          size={'sm-icon'}
          onClick={handleIncrement}
          disabled={disableIncrement}
          className="rounded-full"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export const FormNumberInput: React.FC<TNumberInputProps> = ({ ...rest }) => {
  const { formItemId } = useFormField();
  return <NumberInput id={formItemId} {...rest} />;
};

export default NumberInput;
