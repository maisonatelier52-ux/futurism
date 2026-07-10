'use client';
import { useEffect, useState } from 'react';
import FooterTemplate1 from './footer-templates/FooterTemplate1';
import FooterTemplate2 from './footer-templates/FooterTemplate2';
import FooterTemplate3 from './footer-templates/FooterTemplate3';
import FooterTemplate4 from './footer-templates/FooterTemplate4';
import FooterTemplate5 from './footer-templates/FooterTemplate5';
import FooterTemplate6 from './footer-templates/FooterTemplate6';
import { DEFAULT_FOOTER_CONFIG } from '@/lib/footerDefaults';
import { apiFetch } from '@/lib/apiConfig';

const TEMPLATES = {
  'template-1': FooterTemplate1,
  'template-2': FooterTemplate2,
  'template-3': FooterTemplate3,
  'template-4': FooterTemplate4,
  'template-5': FooterTemplate5,
  'template-6': FooterTemplate6,
};

export default function Footer() {
  const [config, setConfig] = useState(DEFAULT_FOOTER_CONFIG);

  useEffect(() => {
    apiFetch('/api/footer')
      .then(r => r.json())
      .then(d => { if (d.config) setConfig(d.config); })
      .catch(() => {});
  }, []);

  const ActiveTemplate = TEMPLATES[config?.activeTemplate] || FooterTemplate1;
  return <ActiveTemplate config={config} />;
}
