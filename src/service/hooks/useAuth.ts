import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchGetUserInfo, fetchLogin, fetchRefreshToken } from '../api';
import { MUTATION_KEYS, QUERY_KEYS } from '../keys';

/**
 * Login hook
 *
 * @example
 *   const { mutate: login, isPending } = useLogin();
 *   login({ userName: 'admin', password: '123456' });
 */
export function useLogin() {
  return useMutation({
    mutationFn: ({ password, userName }: { password: string; userName: string }) => fetchLogin(userName, password),
    mutationKey: MUTATION_KEYS.AUTH.LOGIN
  });
}

/**
 * Get user info hook
 *
 * @example
 *   const { data: userInfo, isLoading } = useUserInfo();
 *
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUserInfo(enabled = true) {
  return useQuery({
    enabled,
    queryFn: fetchGetUserInfo,
    queryKey: QUERY_KEYS.AUTH.USER_INFO
  });
}

/**
 * Refresh token hook
 *
 * @example
 *   const { mutate: refreshToken } = useRefreshToken();
 *   refreshToken('your-refresh-token');
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => fetchRefreshToken(refreshToken),
    mutationKey: MUTATION_KEYS.AUTH.REFRESH_TOKEN
  });
}
