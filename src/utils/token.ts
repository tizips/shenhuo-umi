import Constants from './Constants';

const toTokenPair = (value: unknown): APIBasicLogin.Response | undefined => {
  let source = value;

  if (typeof source === 'string') {
    try {
      source = JSON.parse(source);
    } catch {
      return undefined;
    }
  }

  if (!source || typeof source !== 'object') return undefined;

  const tokenPair = source as Record<string, unknown>;
  const isPositiveInteger = (item: unknown) => Number.isInteger(item) && Number(item) > 0;

  if (
    typeof tokenPair.session_id !== 'string' ||
    tokenPair.session_id === '' ||
    typeof tokenPair.access_token !== 'string' ||
    tokenPair.access_token === '' ||
    typeof tokenPair.refresh_token !== 'string' ||
    tokenPair.refresh_token === '' ||
    !isPositiveInteger(tokenPair.issued_at) ||
    !isPositiveInteger(tokenPair.access_lifetime) ||
    !isPositiveInteger(tokenPair.refresh_lifetime) ||
    (tokenPair.grace_lifetime !== undefined &&
      (!Number.isInteger(tokenPair.grace_lifetime) || Number(tokenPair.grace_lifetime) < 0))
  ) {
    return undefined;
  }

  return {
    session_id: tokenPair.session_id,
    access_token: tokenPair.access_token,
    refresh_token: tokenPair.refresh_token,
    issued_at: Number(tokenPair.issued_at),
    access_lifetime: Number(tokenPair.access_lifetime),
    refresh_lifetime: Number(tokenPair.refresh_lifetime),
    ...(tokenPair.grace_lifetime === undefined
      ? {}
      : { grace_lifetime: Number(tokenPair.grace_lifetime) }),
  };
};

export const clearTokenPair = () => {
  localStorage.removeItem(Constants.TokenPair);
  localStorage.removeItem(Constants.Authorization);
};

export const storeTokenPair = (value: unknown) => {
  const tokenPair = toTokenPair(value);

  if (!tokenPair) return false;

  localStorage.setItem(Constants.TokenPair, JSON.stringify(tokenPair));
  localStorage.setItem(Constants.Authorization, tokenPair.access_token);
  return true;
};

export const getTokenHeaders = (now = Math.floor(Date.now() / 1000)) => {
  const value = localStorage.getItem(Constants.TokenPair);
  const tokenPair = toTokenPair(value);

  if (!tokenPair) {
    if (value) clearTokenPair();
    return {};
  }

  if (now >= tokenPair.issued_at + tokenPair.refresh_lifetime) {
    clearTokenPair();
    return {};
  }

  const headers: Record<string, string> = {
    [Constants.Authorization]: tokenPair.access_token,
  };

  if (now >= tokenPair.issued_at + tokenPair.access_lifetime) {
    headers[Constants.RefreshToken] = tokenPair.refresh_token;
  }

  return headers;
};
