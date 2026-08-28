import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  publicDir: 'public/extension',
  outDir: '.output',
  manifest: {
    name: 'App Flow Reader',
    description: 'Record app clicks and page changes as a readable flow.',
    version: '1.0.0',
    permissions: ['storage', 'activeTab'],
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
