import { differenceInCalendarDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const DateFormats = {
  DAY: 'dd',
  DAY_IN_LETTER: 'EEEE',
  MONTH: 'MM',
  MONTH_IN_LETTER: 'MMMM',
  YEAR: 'yyyy',
  HOUR: 'HH',
  MINUTE: 'mm',
  SECOND: 'ss',

  SHORT: 'LLL dd, y',

  get FULL() {
    return `${this.DAY_IN_LETTER} ${this.DAY} ${this.MONTH_IN_LETTER} ${this.YEAR} ${this.HOUR}:${this.MINUTE}:${this.SECOND}`;
  },
  get LONG_DATE_WITH_HOUR() {
    return `${this.DAY_IN_LETTER} ${this.DAY} ${this.MONTH_IN_LETTER} ${this.YEAR} à ${this.HOUR}:${this.MINUTE}`;
  },
  get SHORT_DATE_WITH_HOUR() {
    return `${this.DAY}/${this.MONTH}/${this.YEAR} à ${this.HOUR}:${this.MINUTE}`;
  },
};

type TDateFormatsKeys = keyof typeof DateFormats;
type TDateFormatsParams = {
  date: Date;
} & (
  | {
      type: TDateFormatsKeys;
      separator?: never;
    }
  | {
      type: TDateFormatsKeys[];
      separator?: string;
    }
);

export const getDateAsString = ({
  date,
  type,
  separator,
}: TDateFormatsParams) => {
  if (Array.isArray(type)) {
    return type
      .map((t) => format(date, DateFormats[t], { locale: fr }))
      .join(separator || ' ');
  }
  return format(date, DateFormats[type], { locale: fr });
};

export const getNearDate = (date: Date) => {
  const today = new Date();

  switch (differenceInCalendarDays(date, today)) {
    case 0:
      return (
        "Aujourd'hui à " +
        getDateAsString({ date, type: ['HOUR', 'MINUTE'], separator: ':' })
      );
    case 1:
      return (
        'Demain à ' +
        getDateAsString({ date, type: ['HOUR', 'MINUTE'], separator: ':' })
      );
    case 2:
      return (
        'Après demain à ' +
        getDateAsString({ date, type: ['HOUR', 'MINUTE'], separator: ':' })
      );
    default:
      return getDateAsString({ date, type: 'LONG_DATE_WITH_HOUR' });
  }
};
