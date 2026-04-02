import { useEffect, useRef } from 'react';

const ADSENSE_SCRIPT_BASE_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

function ensureAdSenseScript(clientId) {
  const scriptSelector = `script[data-adsense-client="${clientId}"]`;
  const existingScript = document.querySelector(scriptSelector);

  if (existingScript) {
    if (existingScript.dataset.loaded === 'true') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `${ADSENSE_SCRIPT_BASE_URL}?client=${clientId}`;
    script.crossOrigin = 'anonymous';
    script.dataset.adsenseClient = clientId;

    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });

    script.addEventListener('error', reject, { once: true });

    document.head.appendChild(script);
  });
}

function AdSenseBanner({ slotId: slotIdProp, outerClassName = '', innerClassName = '' }) {
  const adRef = useRef(null);
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID?.trim();
  const slotId = slotIdProp?.trim() || import.meta.env.VITE_ADSENSE_SLOT_ID?.trim();

  useEffect(() => {
    if (!clientId || !slotId || !adRef.current) {
      return;
    }

    let isCancelled = false;

    async function initializeAd() {
      try {
        await ensureAdSenseScript(clientId);

        if (isCancelled || !adRef.current || adRef.current.dataset.adInitialized === 'true') {
          return;
        }

        adRef.current.dataset.adInitialized = 'true';
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (error) {
        console.error('Failed to initialize AdSense.', error);
      }
    }

    initializeAd();

    return () => {
      isCancelled = true;
    };
  }, [clientId, slotId]);

  if (!clientId || !slotId) {
    return null;
  }

  return (
    <div className={outerClassName}>
      <div className={`bg-white border border-stone-200 rounded-2xl p-4 shadow-sm ${innerClassName}`.trim()}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

export default AdSenseBanner;
