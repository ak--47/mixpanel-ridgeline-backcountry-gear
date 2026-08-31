import React from 'react';
import { Mountain, Instagram, Twitter, Youtube, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { track, getProfileUrl } from '@/lib/analytics';

const LINK_GROUPS = [
  {
    group: 'equipment',
    heading: 'Equipment',
    links: [
      { label: 'Touring Skis', href: '/shop?category=skis' },
      { label: 'Splitboards', href: '/shop?category=splitboards' },
      { label: 'Avalanche Safety', href: '/shop?category=safety' },
      { label: 'Technical Apparel', href: '/shop?category=apparel' },
    ],
  },
  {
    group: 'culture',
    heading: 'Culture',
    links: [
      { label: 'Field Guide', href: '/journal' },
      { label: 'Expedition Stories', href: '/journal' },
      { label: 'Our Ethos', href: '#' },
      { label: 'Pro Team', href: '#' },
    ],
  },
];

const SUPPORT_LINKS = [
  { label: 'Shipping & Returns', href: '#' },
  { label: 'Warranty', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const SOCIAL_LINKS = [
  { platform: 'instagram', Icon: Instagram },
  { platform: 'twitter', Icon: Twitter },
  { platform: 'youtube', Icon: Youtube },
];

export function Footer() {
  const trackFooterLink = (group: string, label: string, href: string) =>
    track('footer_link_clicked', {
      link_group: group,
      link_text: label,
      link_href: href,
    });

  return (
    <footer className="bg-secondary text-secondary-foreground py-16 border-t border-border/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              onClick={() => trackFooterLink('brand', 'logo', '/')}
              data-analytics-event="footer_link_clicked"
              data-analytics-link-text="logo"
              className="flex items-center gap-2 mb-6 group"
            >
              <Mountain className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl tracking-tight uppercase">RIDGELINE</span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed max-w-xs">
              Equipping dedicated backcountry travelers with the tools, knowledge, and inspiration to push deeper into the mountains.
            </p>
          </div>
          
          {LINK_GROUPS.map(({ group, heading, links }) => (
            <div key={group}>
              <h4 className="font-display font-semibold mb-4 text-white">{heading}</h4>
              <ul className="space-y-3 text-sm text-secondary-foreground/70">
                {links.map((link) => (
                  <li key={`${group}-${link.label}`}>
                    <Link
                      href={link.href}
                      onClick={() => trackFooterLink(group, link.label, link.href)}
                      data-analytics-event="footer_link_clicked"
                      data-analytics-link-group={group}
                      data-analytics-link-text={link.label}
                      className="hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => trackFooterLink('support', link.label, link.href)}
                    data-analytics-event="footer_link_clicked"
                    data-analytics-link-group="support"
                    data-analytics-link-text={link.label}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 flex gap-4">
                {SOCIAL_LINKS.map(({ platform, Icon }) => (
                  <a
                    key={platform}
                    href="#"
                    onClick={() => track('social_link_clicked', { platform })}
                    data-analytics-event="social_link_clicked"
                    data-analytics-platform={platform}
                    aria-label={`Ridgeline Supply Co. on ${platform}`}
                    className="hover:text-primary transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} Ridgeline Supply Co. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service'].map((label) => (
              <a
                key={label}
                href="#"
                onClick={() => trackFooterLink('legal', label, '#')}
                data-analytics-event="footer_link_clicked"
                data-analytics-link-group="legal"
                data-analytics-link-text={label}
                className="hover:text-white"
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                const url = getProfileUrl();
                if (url) window.open(url, '_blank');
              }}
              title="Open this visitor's profile in Mixpanel"
              className="inline-flex items-center gap-2 rounded-sm border border-secondary-foreground/20 px-3 py-1.5 hover:text-white hover:border-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open Mixpanel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
