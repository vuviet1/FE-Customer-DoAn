import { useEffect } from 'react';

const StyleManager = ({ urls, idPrefix }) => {
  useEffect(() => {
    const links = urls.map((url, index) => {
      const existingLink = document.getElementById(`${idPrefix}-style-${index}`);
      if (existingLink) return existingLink;

      const link = document.createElement('link');
      link.href = url;
      link.rel = 'stylesheet';
      link.id = `${idPrefix}-style-${index}`;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach(link => {
        if (link.parentElement === document.head) {
          document.head.removeChild(link);
        }
      });
    };
  }, [urls, idPrefix]);

  return null;
};

export default StyleManager;
