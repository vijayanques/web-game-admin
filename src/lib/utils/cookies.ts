// Client-side cookie utilities using document.cookie

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export function setCookie(name: string, value: string, options?: CookieOptions) {
  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (options?.maxAge) {
    cookieString += `; Max-Age=${options.maxAge}`;
  }
  if (options?.path) {
    cookieString += `; Path=${options.path}`;
  }
  if (options?.domain) {
    cookieString += `; Domain=${options.domain}`;
  }
  if (options?.secure) {
    cookieString += '; Secure';
  }
  if (options?.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

export function getCookie(name: string): string | undefined {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  
  return undefined;
}

export function deleteCookie(name: string) {
  setCookie(name, '', {
    maxAge: -1,
    path: '/',
  });
}

