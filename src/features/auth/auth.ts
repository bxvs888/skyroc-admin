import { useLoading } from '@sa/hooks';

import { globalConfig } from '@/config';
import { getIsLogin } from '@/features/auth/authStore';
import { usePreviousRoute, useRouter } from '@/features/router';
import { useLogin, useUserInfo } from '@/service/hooks';
import { localStg } from '@/utils/storage';

import { useCacheTabs } from '../tab/tabHooks';

import { resetAuth as resetAuthAction, setToken } from './authStore';
import { clearAuthStorage } from './shared';

const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

export function useAuth() {
  const { data } = useUserInfo();

  const isLogin = useAppSelector(getIsLogin);

  const isStaticSuper = VITE_AUTH_ROUTE_MODE === 'static' && data?.roles.includes(VITE_STATIC_SUPER_ROLE);

  function hasAuth(codes: string | string[]) {
    if (!isLogin || !data) {
      return false;
    }

    if (typeof codes === 'string') {
      return data.buttons.includes(codes);
    }

    return codes.some(code => data.buttons.includes(code));
  }

  return {
    hasAuth,
    isStaticSuper
  };
}

export function useInitAuth() {
  const { endLoading, loading, startLoading } = useLoading();

  const [searchParams] = useSearchParams();

  const { mutate: login } = useLogin();

  const { refetch: refetchUserInfo } = useUserInfo();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { replace } = useRouter();

  const redirectUrl = searchParams.get('redirect');

  async function toLogin(params: Api.Auth.LoginParams, redirect = true) {
    if (loading) return;

    startLoading();

    login(params, {
      onSuccess: async data => {
        localStg.set('token', data.token);

        localStg.set('refreshToken', data.refreshToken);

        const { data: info, error } = await refetchUserInfo();

        if (!error && info) {
          localStg.set('userInfo', info);

          dispatch(setToken(data.token));

          if (redirect) {
            if (redirectUrl) {
              replace(redirectUrl);
            } else {
              replace(globalConfig.homePath);
            }
          }

          window.$notification?.success({
            description: t('page.login.common.welcomeBack', { userName: info.userName }),
            message: t('page.login.common.loginSuccess')
          });
        } else {
          endLoading();
        }
      }
    });
  }

  return {
    loading,
    toLogin
  };
}

export function useResetAuth() {
  const dispatch = useAppDispatch();

  const previousRoute = usePreviousRoute();

  const cacheTabs = useCacheTabs();

  const { navigate, push, resetRoutes } = useRouter();

  function resetAuth() {
    clearAuthStorage();

    dispatch(resetAuthAction());

    resetRoutes();

    cacheTabs();

    if (!previousRoute?.handle?.constant) {
      if (previousRoute?.fullPath) {
        push('/login', { redirect: previousRoute.fullPath }, null, true);
      } else {
        navigate('/login', { replace: true });
      }
    }
  }

  return resetAuth;
}
