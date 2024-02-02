export const siteConfig = {
  name: 'chientrm.com',
  title: 'You may find something useful here',
  description: 'Personal blogs, some useful tools.',
  keywords:
    'threejs, tools, personal, svelte, sveltekit, cloudflare, blogs, d1, wrangler',
  github: 'https://github.com/chientrm/com',
  email: 'admin@chientrm.com',
  mailto: 'mailto:admin@chientrm.com',
  twitter: 'https://x.com/realchientrm'
};

export const footerConfig: {
  name: string;
  items: { name: string; href: string; target?: '_blank' }[];
}[] = [
  {
    name: 'chientrm.com',
    items: [
      { name: 'Thread', href: '/thread' },
      { name: 'Globe', href: '/globe' },
      { name: 'Counter', href: '/counter' }
    ]
  },
  {
    name: 'Backlinks',
    items: [
      { name: 'TorrentChill.com', href: 'https://torrentchill.com' },
      { name: 'ShitpostAI.com', href: 'https://shitpostai.com' },
      { name: 'PewXPew', href: 'https://pewxpew.com' },
      { name: 'RocketMouse', href: 'https://rocketmouse.chientrm.com' }
    ]
  },
  {
    name: 'Company',
    items: [
      { name: 'About', href: '/about' },
      { name: 'X', href: siteConfig.twitter, target: '_blank' },
      { name: 'FAQ', href: '/faq' }
    ]
  }
];
