import { getServerUrl } from './getServer';

export type TClientRouteDataRequirements = {
  'client-auth': {
    type: 'signup' | 'login';
  };
  'client-home': undefined;
  'client-search': {
    type: 'forYou' | 'advancedSearch';
  };
  'client-notifications': undefined;
  'client-profile': {
    id?: number | undefined;
  };
};
export type TApiRouteDataRequirements = {
  'api-auth': {
    type: 'signup' | 'login' | 'logout' | 'session' | undefined;
  };
  'api-tags': {
    id?: number;
    type?: 'new' | 'user';
  };
  'api-globalLocations': undefined;
  'api-search': {
    type: 'advancedSearch' | 'forYou';
  };
  'api-users': {
    id?: number | undefined;
  };
  'api-messages': {
    id?: number;
  };
  'api-picture': {
    id?: number;
    type?: 'new' | 'user-pp' | 'user';
  };
};

type TRouteDataRequirements = TClientRouteDataRequirements &
  TApiRouteDataRequirements;

type TRoute = keyof TRouteDataRequirements;

type TRouteDataMap<T extends TRoute> = T extends keyof TRouteDataRequirements
  ? TRouteDataRequirements[T]
  : never;

const routes: {
  [T in TRoute]: (params: TRouteDataMap<T>) => string;
} = {
  'client-auth': ({ type }) => `/auth/${type}`,
  'client-home': () => '/',
  'client-search': ({ type }) => `/research/${type}`,
  'client-notifications': () => '/notifications',
  'client-profile': ({ id }) => (id ? `/profile/${id}` : '/profile'),

  'api-auth': ({ type }) => (type ? `/api/auth/${type}` : '/api/auth'),
  'api-tags': ({ id, type }) => {
    if (type) {
      if (['user'].includes(type) && id) {
        return `/api/tags/${type}/${id}`;
      }
      return `/api/tags/${type}`;
    }
    return '/api/tags';
  },
  'api-globalLocations': () => '/api/globalLocations',
  'api-search': ({ type }) => (type ? `/api/search/${type}` : '/api/search'),
  'api-users': ({ id }) => (id ? `/api/users/${id}` : '/api/users'),
  'api-messages': ({ id }) => (id ? `/api/messages/${id}` : '/api/messages'),
  'api-picture': ({ id, type }) => {
    if (type) {
      if (['user-pp', 'user'].includes(type) && id) {
        return `/api/picture/${type}/${id}`;
      }
      return `/api/picture/${type}`;
    }
    return id ? `/api/picture/${id}` : '/api/picture';
  },
};

type TUrlParams =
  | string[][]
  | Record<string, string>
  | string
  | URLSearchParams;

type TGetUrlArgs<T extends TRoute> = TRouteDataMap<T> extends undefined
  ? { withServerUrl?: boolean; urlParams?: TUrlParams }
  : TRouteDataMap<T> & {
      withServerUrl?: boolean;
      urlParams?: TUrlParams;
    };

/**
 * Get URL by route name
 *
 * client- routes are for client side
 *
 * api- routes are for server side
 */
export const getUrl = <T extends TRoute>(
  route: T,
  params?: TGetUrlArgs<T>
): string => {
  const { withServerUrl = false, urlParams, ...rawParams } = params || {};

  const routeParams = rawParams as TRouteDataMap<T>;

  const routeFn = routes[route];

  const computedUrl = routeFn(routeParams);

  const serverUrl = withServerUrl ? getServerUrl() : '';

  const parsedUrlParams = urlParams
    ? `?${new URLSearchParams(urlParams).toString()}`
    : '';

  return `${serverUrl}${
    serverUrl ? computedUrl.slice(1) : computedUrl
  }${parsedUrlParams}`;
};
