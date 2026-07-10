'use client';
import { useEffect, useState } from 'react';
import HeaderTemplate1 from './header-templates/HeaderTemplate1';
import HeaderTemplate2 from './header-templates/HeaderTemplate2';
import HeaderTemplate3 from './header-templates/HeaderTemplate3';
import HeaderTemplate4 from './header-templates/HeaderTemplate4';
import HeaderTemplate5 from './header-templates/HeaderTemplate5';
import HeaderTemplate6 from './header-templates/HeaderTemplate6';
import HeaderTemplate7 from './header-templates/HeaderTemplate7';
import { DEFAULT_HEADER_CONFIG } from '@/lib/headerDefaults';
import { apiFetch } from '@/lib/apiConfig';

const TEMPLATES = {
  'template-1': HeaderTemplate1,
  'template-2': HeaderTemplate2,
  'template-3': HeaderTemplate3,
  'template-4': HeaderTemplate4,
  'template-5': HeaderTemplate5,
  'template-6': HeaderTemplate6,
  'template-7': HeaderTemplate7,
};

export default function Header() {
  const [config, setConfig] = useState(DEFAULT_HEADER_CONFIG);

  useEffect(() => {
    apiFetch('/api/header')
      .then(r => r.json())
      .then(d => { if (d.config) setConfig(d.config); })
      .catch(() => {}); // falls back to DEFAULT_HEADER_CONFIG already set in state
  }, []);

  const ActiveTemplate = TEMPLATES[config?.activeTemplate] || HeaderTemplate1;
  return <ActiveTemplate config={config} />;
}
