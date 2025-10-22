import React, { useEffect, useMemo, useState } from 'react';

/**
 * Tiny client-side router using History API.
 */

export const navigate = (to) => {
  if (window.location.pathname === to) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const normalizePath = (path) => {
  if (!path) return '/';
  try {
    const url = new URL(path, window.location.origin);
    return url.pathname.replace(/\/$/, '') || '/';
  } catch {
    return '/';
  }
};

export const Router = ({ routes, notFound: NotFound = () => null }) => {
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


