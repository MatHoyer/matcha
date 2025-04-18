import { getServerUrl } from './getServer';

export type TClientRouteDataRequirements = {
  'client-auth': {
    type: 'signup' | 'login' | 'confirm' | 'wait-confirm';
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
    type:
      | 'signup'
      | 'login'
      | 'logout'
      | 'session'
      | 'confirm'
      | 'resend-confirm'
      | undefined;
  };
  'api-tags': {
    id?: number;
    type?: 'new' | 'user';
  };
  'api-globalLocations': undefined;
  'api-search': {
    id?: number;
    type: 'advancedSearch' | 'forYou';
  };
  'api-users': {
    id?: number;
    type?:
      | 'reset-password'
      | 'fame'
      | 'match'
      | 'matched'
      | 'isBlocked'
      | 'blockedMe';
  };
  'api-messages': {
    id?: number;
  };
  'api-notifications': {
    type: 'get' | 'update';
  };
  'api-picture': {
    id?: number;
    type?: 'new' | 'user-pp' | 'user';
  };
  'api-likes': {
    id?: number;
    type?: 'new' | 'is-liked' | 'likes-me';
  };
  'api-location': {
    id?: number;
    type?: 'is-need-update' | 'near/user';
  };
  'api-block': undefined;
  'api-report': {
    userId: number;
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
  // 'api-search': ({ type }) => (type ? `/api/search/${type}` : '/api/search'),
  'api-search': ({ id, type }) => {
    if (type) {
      if (id) {
        return `/api/search/${type}/${id}`;
      }
      return `/api/search/${type}`;
    }
    return '/api/search';
  },
  'api-users': ({ id, type }) => {
    if (type) {
      if (['reset-password'].includes(type)) {
        return `/api/users/password/${type}`;
      }
      return `/api/users/${type}/${id}`;
    }
    return id ? `/api/users/${id}` : '/api/users';
  },
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
  'api-notifications': ({ type }) =>
    type ? `/api/notifications/${type}` : '/api/notifications',
  'api-likes': ({ id, type }) => {
    if (type) {
      if (['is-liked', 'likes-me'].includes(type) && id) {
        return `/api/likes/${type}/${id}`;
      }
      return `/api/likes/${type}`;
    }
    return id ? `/api/likes/${id}` : '/api/likes';
  },
  'api-location': ({ id, type }) => {
    if (type) {
      if (['near/user'].includes(type) && id) {
        return `/api/location/${type}/${id}`;
      }
      return `/api/location/${type}`;
    }
    return id ? `/api/location/${id}` : '/api/location';
  },
  'api-block': () => '/api/block',
  'api-report': ({ userId }) =>
    userId ? `/api/report/${userId}` : '/api/report',
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
