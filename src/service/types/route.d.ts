/**
 * Namespace Api.Route
 *
 * Backend api module: "route"
 */
declare namespace Api {
  namespace Route {
    type ElegantConstRoute = import('@soybean-react/vite-plugin-react-router').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      home: import('@soybean-react/vite-plugin-react-router').LastLevelRouteKey;
      routes: string[];
    }
  }
}
