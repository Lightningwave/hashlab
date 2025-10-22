import React, { useEffect, useMemo, useState } from 'react';

/**
 * Tiny client-side router using History API.
 */

const basePath = (import.meta?.env?.BASE_URL || '/').replace(/\/$/, '');

export const navigate = (to) => {
  const target = to.startsWith('/') ? `${basePath}${to}` : `${basePath}/${to}`;
  if (window.location.pathname === target) return;
  window.history.pushState({}, '', target);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const normalizePath = (path) => {
  if (!path) return '/';
  try {
    const url = new URL(path, window.location.origin);
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    // Strip the base path prefix so routes can be defined without it
    if (basePath && pathname.startsWith(basePath)) {
      const stripped = pathname.slice(basePath.length) || '/';
      return stripped === '' ? '/' : stripped;
    }
    return pathname;
  } catch {
    return '/';
  }
};

const DefaultNotFound = () => <div style={{ padding: '24px' }}>Page not found</div>;

export const Router = ({ routes, notFound: NotFound = DefaultNotFound }) => {
  const routeTable = useMemo(() => {
    const map = new Map();
    routes.forEach(({ path, element }) => {
      const key = normalizePath(path);
      map.set(key, element);
    });
    return map;
  }, [routes]);

  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setCurrentPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Debug current route in production once to diagnose blank page
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__hashlab_logged) {
      window.__hashlab_logged = true;
      try {
        // eslint-disable-next-line no-console
        console.log('[Router] basePath=', basePath, 'currentPath=', currentPath, 'routeKeys=', Array.from(routeTable.keys()));
        // eslint-disable-next-line no-console
        console.log('[Router] window.location.pathname=', window.location.pathname);
        // eslint-disable-next-line no-console
        console.log('[Router] Element found=', !!routeTable.get(currentPath));
      } catch {}
    }
  }, [currentPath, routeTable]);

  const Element = routeTable.get(currentPath) || NotFound;
  return <Element />;
};

export const Link = ({ to, children, style, onClick, onMouseEnter, onMouseLeave, ...props }) => {
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        if (onClick) onClick(e);
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      {...props}
    >
      {children}
    </a>
  );
};


