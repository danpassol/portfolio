export const siteConfig = {
  name: 'dpastor.eu',
  description: 'Portfolio de Dani Pastor, administrador de sistemas',
  logo: {
    src: '/logo.svg',
    srcDark: '/logo-black.svg',
    alt: 'dpastor Logo',
    strategy: 'switch' as 'invert' | 'switch' | 'static',
  },
  ogImage: '/og-image.webp',
  primaryColor: '#7c5cfc',
  search: {
    enabled: true,
  },
  blog: {
    postsPerPage: 6,
  },
  contact: {
    email: {
      other: 'hola@dpastor.eu'
    }
  },
  dateOptions: {
    localeMapping: {
        'es': 'es-ES',
        'en': 'en-GB',
    }
  }
};

export const NAV_LINKS = [
  { 
    href: '/blog', 
    label: 'Blog',
  },
  { 
    href: '/projects', 
    label: 'Projects',
  },
  { 
    href: '/about', 
    label: 'About',
  },
];

export const ACTION_LINKS = {
  primary: { label: 'Contact', href: '/contact' },
  social: { 
    linkedin: 'https://linkedin.com/in/danpassol',
    github: 'https://github.com/danpassol',
  }
};

export const FOOTER_LINKS = {
  product: {
    title: 'Pages',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/projects', label: 'Projects' },
      { href: '/about', label: 'About' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy', localize: false },
      { href: '/terms', label: 'Terms', localize: false }
    ],
  },
};
