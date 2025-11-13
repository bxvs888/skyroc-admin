import { request } from '../request';
import { AUTH_URLS } from '../urls';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string) {
  return request<Api.Auth.LoginToken>({
    data: {
      password,
      userName
    },
    method: 'post',
    url: AUTH_URLS.LOGIN
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: AUTH_URLS.GET_USER_INFO });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    data: {
      refreshToken
    },
    method: 'post',
    url: AUTH_URLS.REFRESH_TOKEN
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ params: { code, msg }, url: AUTH_URLS.ERROR });
}
