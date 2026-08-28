import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  publicDir: 'public/extension',
  outDir: '.output',
  manifest: {
    name: 'App Flow Reader',
    description: 'Save and follow clear routes through dense workplace apps.',
    version: '1.1.0',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['https://api.sociobot.in/*'],
    action: { default_title: 'Open App Flow Reader' },
    icons: {
      16: 'icon-16.png',
      32: 'icon-32.png',
      48: 'icon-48.png',
      128: 'icon-128.png'
    },
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'"
    }
  }
});
