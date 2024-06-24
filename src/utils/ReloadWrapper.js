import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ReloadWrapper = ({ element }) => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const reloadedPath = sessionStorage.getItem('reloadedPath');

    if (currentPath !== reloadedPath) {
      sessionStorage.setItem('reloadedPath', currentPath);
      window.location.reload();
    }
  }, [location.pathname]);

  return element;
};

export default ReloadWrapper;
