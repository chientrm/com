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
      { name: 'thread', href: '/thread' },
      { name: 'blog', href: '/blog' },
      { name: 'globe', href: '/globe' },
      { name: 'are you not entertained?', href: '/are-you-not-entertained' },
      { name: 'changelogs', href: '/changelogs' }
    ]
  },
  {
    name: 'backlinks',
    items: [
      {
        name: 'TorrentChill.com',
        href: 'https://torrentchill.com',
        target: '_blank'
      },
      {
        name: 'ShitpostAI.com',
        href: 'https://shitpostai.com',
        target: '_blank'
      },
      { name: 'PewXPew', href: 'https://pewxpew.com', target: '_blank' },
      {
        name: 'RocketMouse',
        href: 'https://rocketmouse.chientrm.com',
        target: '_blank'
      }
    ]
  },
  {
    name: 'company',
    items: [
      { name: 'about', href: '/about' },
      { name: 'x', href: siteConfig.twitter, target: '_blank' },
      { name: 'faq', href: '/faq' }
    ]
  }
];
