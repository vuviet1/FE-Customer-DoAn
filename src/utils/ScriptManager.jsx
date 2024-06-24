import { useEffect } from 'react';

const ScriptManager = ({ urls, idPrefix }) => {
  useEffect(() => {
    const scripts = urls.map((url, index) => {
      const existingScript = document.getElementById(`${idPrefix}-script-${index}`);
      if (existingScript) return existingScript;

      const script = document.createElement('script');
      script.src = url;
      script.async = false;
      script.id = `${idPrefix}-script-${index}`;
      document.body.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach(script => {
        if (script.parentElement === document.body) {
          document.body.removeChild(script);
        }
      });
    };
  }, [urls, idPrefix]);

  return null;
};

export default ScriptManager;
