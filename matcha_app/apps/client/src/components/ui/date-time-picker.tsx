import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getDateAsString } from '@matcha/common';
import {
  getHours,
  getMinutes,
  getMonth,
  getYear,
  setHours,
  setMinutes,
  setMonth,
  setYear,
} from 'date-fns';
import { CalendarIcon, ChevronDown, Clock } from 'lucide-react';
import { ComponentProps, Dispatch, SetStateAction, useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { ScrollArea, ScrollBar } from './scroll-area';
import { Typography } from './typography';

const LocalTimePicker: React.FC<{
  date: Date;
  setDate: (date: Date) => void;
  setIsOpen?: Dispatch<React.SetStateAction<boolean>>;
}> = ({ date, setDate, setIsOpen }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === 'hour') {
        newDate.setHours(parseInt(value));
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value));
        if (setIsOpen) setIsOpen(false);
      }
      setDate(newDate);
    }
  };

  return (
    <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
      <ScrollArea className="w-64 sm:w-auto">
        <div className="flex p-2 sm:flex-col">
          {hours.map((hour) => (
            <Button
              key={hour}
              size="icon"
              variant={date && getHours(date) === hour ? 'default' : 'ghost'}
              className="aspect-square shrink-0 sm:w-full"
              onClick={() => handleTimeChange('hour', hour.toString())}
            >
              {hour}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="sm:hidden" />
      </ScrollArea>
      <ScrollArea className="w-64 sm:w-auto">
        <div className="flex p-2 sm:flex-col">
          {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
            <Button
              key={minute}
              size="icon"
              variant={
                date && getMinutes(date) === minute ? 'default' : 'ghost'
              }
              className="aspect-square shrink-0 sm:w-full"
              onClick={() => handleTimeChange('minute', minute.toString())}
            >
              {minute.toString().padStart(2, '0')}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="sm:hidden" />
      </ScrollArea>
    </div>
  );
};

export const TimePicker: React.FC<{
  value: Date;
  onChange: Dispatch<SetStateAction<Date>>;
  modal?: boolean;
}> = ({ value: date, onChange: setDate, modal }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover modal={modal} open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <Clock className="mr-2 size-4" />
          {date ? (
            <span>
              {getDateAsString({
                date,
                type: ['HOUR', 'MINUTE'],
                separator: ':',
              })}
            </span>
          ) : (
            <span>HH:mm</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <LocalTimePicker date={date} setDate={setDate} setIsOpen={setIsOpen} />
      </PopoverContent>
    </Popover>
  );
};

export const DatePicker: React.FC<{
  value: Date;
  onChange: (date: Date) => void;
  withTime?: boolean;
  modal?: boolean;
}> = ({ value: date, onChange: setDate, withTime, modal = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [monthSelected, setMonthSelected] = useState(date);
  const [yearSelectorOpen, setYearSelectorOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setHours(selectedDate, getHours(date));
      setMinutes(selectedDate, getMinutes(date));
      setMonth(selectedDate, getMonth(monthSelected));
      setYear(selectedDate, getYear(monthSelected));
      setDate(selectedDate);
    }
    if (!withTime) {
      setIsOpen(false);
    }
  };

  const handleMonthChange = (month: Date) => {
    console.log(month);
    setMonthSelected(month);
  };

  return (
    <Popover modal={modal} open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? (
            <span>
              {getDateAsString({
                date,
                type: 'SHORT',
              })}
              {withTime
                ? ` à ${getDateAsString({
                    date,
                    type: ['HOUR', 'MINUTE'],
                    separator: ':',
                  })}`
                : ''}
            </span>
          ) : (
            <span>MM/DD/YYYY HH:mm</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            month={monthSelected}
            onMonthChange={handleMonthChange}
            CaptionLabel={() => (
              <div className="flex items-center justify-between w-full gap-2 pl-14 pr-10">
                <Typography variant="small">
                  {getDateAsString({
                    date: monthSelected,
                    type: 'MONTH_IN_LETTER',
                  })}
                </Typography>
                <DropdownMenu
                  open={yearSelectorOpen}
                  onOpenChange={setYearSelectorOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-full">
                      {getDateAsString({
                        date: monthSelected,
                        type: 'YEAR',
                      })}
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <ScrollArea className="h-72">
                      <div className="grid grid-cols-3 gap-2 p-2">
                        {Array.from({ length: 200 }, (_, i) => {
                          const year = getYear(new Date()) - i;
                          return (
                            <DropdownMenuItem
                              key={year}
                              onClick={() => {
                                let newDate = new Date(monthSelected);
                                newDate = setYear(newDate, year);
                                console.log(newDate);
                                handleMonthChange(newDate);
                                setYearSelectorOpen(false);
                              }}
                              className="flex items-center justify-center cursor-pointer"
                            >
                              {year}
                            </DropdownMenuItem>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            initialFocus
          />
          {withTime && (
            <LocalTimePicker
              date={date}
              setDate={setDate}
              setIsOpen={setIsOpen}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const DateRangePicker: React.FC<
  {
    value: DateRange;
    onChange: Dispatch<SetStateAction<DateRange | undefined>>;
    modal?: boolean;
  } & ComponentProps<'div'>
> = ({
  value: date,
  onChange: setDate,
  modal = false,
  className,
  ...props
}) => {
  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
  };

  return (
    <div className={cn('grid gap-2', className)} {...props}>
      <Popover modal={modal}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {getDateAsString({
                    date: date.from,
                    type: 'SHORT',
                  })}{' '}
                  -{' '}
                  {getDateAsString({
                    date: date.to,
                    type: 'SHORT',
                  })}
                </>
              ) : (
                getDateAsString({
                  date: date.from,
                  type: 'SHORT',
                })
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
