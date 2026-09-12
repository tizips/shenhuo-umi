import React from 'react';
import { Settings as LayoutSettings } from '@ant-design/pro-components';
import { history, RunTimeLayoutConfig } from '@umijs/max';
import type { AxiosResponse, RequestConfig, RequestOptions } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import Navigation from '@/components/Basic/Navigation';
import UserDropdown from '@/components/Basic/UserDropdown';
import Footer from '@/components/Basic/Footer';
import { doBasicAccount, doBasicModules, doBasicPermissions } from '@/services/basic';
import Constants from '@/utils/Constants';
import { buildPermissionMap, resolveModuleFromPathname } from '@/utils/bootstrap';
import { getTokenHeaders, storeTokenPair } from '@/utils/token';
import 'dayjs/locale/zh-cn';
import { ConfigProvider } from 'antd';

export function rootContainer(container: React.ReactNode) {
  return (
    <ConfigProvider
      modal={{
        centered: true,
        mask: {
          blur: true,
          closable: false,
        },
      }}
      drawer={{
        mask: {
          blur: true,
        },
      }}
      image={{
        preview: {
          mask: {
            blur: true,
          },
        },
      }}
    >
      {container}
    </ConfigProvider>
  );
}

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  module?: string;
  modules?: APIBasic.doBasicModules[];
  account?: APIBasic.doBasicAccount;
  permissions?: Record<string, string>;
  toAccount?: () => Promise<APIBasic.doBasicAccount | undefined>;
  settings?: Partial<LayoutSettings>;
}> {
  const settings = { ...defaultSettings };

  let theme: 'realDark' | 'light' = 'light';

  const cacheTheme = localStorage.getItem('theme');

  if (cacheTheme === 'light' || cacheTheme === 'realDark') {
    theme = cacheTheme;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'realDark';
  }

  settings.navTheme = theme;

  const toAccount = async () => {
    try {
      const response = await doBasicAccount();
      if (response.code === Constants.Success) return response.data;
    } catch (error) {
      history.push(Constants.Login);
    }
    return undefined;
  };

  const pathname = history.location.pathname;

  // 如果不是登录页面，执行

  if (pathname !== Constants.Login) {
    const account = await toAccount();

    if (!account) {
      history.push(Constants.Forbidden);
    } else {
      const modules = await doBasicModules();

      if (modules.code !== Constants.Success || modules.data.length <= 0) {
        history.push(Constants.Forbidden);
      } else {
        const slug = resolveModuleFromPathname(pathname, modules.data);

        const permissions = await doBasicPermissions(slug);

        if (permissions.code !== Constants.Success || permissions.data.length <= 0) {
          history.push(Constants.Forbidden);
        } else {
          return {
            toAccount,
            module: slug,
            modules: modules.data,
            account,
            permissions: buildPermissionMap(permissions.data || []),
            settings,
          };
        }
      }
    }

    return { toAccount, account, settings };
  }

  return {
    toAccount,
    settings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: false,
    headerContentRender: () => initialState?.account && <Navigation />,
    actionsRender: () => [<UserDropdown key="user-dropdown" />],
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.account && location.pathname !== Constants.Login) {
        history.push(Constants.Login);
      }
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const AuthHeaderInterceptor = (options: RequestOptions) => {
  const headers = { ...options.headers };

  delete headers[Constants.RefreshToken];
  delete headers[Constants.RefreshToken.toLowerCase()];
  Object.assign(headers, getTokenHeaders());

  return {
    ...options,
    headers,
  };
};

const RefreshResponse = (response: AxiosResponse) => {
  const tokenPair = response.headers[Constants.TokenPair.toLowerCase()];

  if (typeof tokenPair === 'string') storeTokenPair(tokenPair);

  return response;
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  ...errorConfig,
  requestInterceptors: [AuthHeaderInterceptor],
  responseInterceptors: [RefreshResponse],
};
