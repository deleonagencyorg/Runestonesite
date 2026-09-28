import { site } from './site';

export const siteOrigin = 'https://runestoneconstruction.com';

export const defaultDescription =
  'Florida licensed general contractor CGC1540643 for custom homes, multifamily, and commercial construction in Naples, Fort Myers, Cape Coral, and Southwest Florida.';

export const defaultKeywords = [
  'Runestone Construction',
  'Southwest Florida general contractor',
  'custom home builder Naples',
  'custom home builder Fort Myers',
  'Cape Coral home builder',
  'multifamily construction',
  'commercial construction Southwest Florida',
  'construction management',
  'CGC1540643',
];

export const ogImagePath = '/media/gallery/73-Aerial%20Front%20Exterior%202.webp';

export const faqs = [
  {
    question: 'What does Runestone Construction build?',
    answer:
      'Runestone Construction Corp. is a Florida certified general contractor for custom homes, multifamily buildings such as duplexes and larger developments, commercial projects, and construction management. License number CGC1540643.',
  },
  {
    question: 'Where does Runestone Construction work?',
    answer: `Runestone Construction is based in Fort Myers and builds across Southwest Florida: ${site.cities.join(', ')}.`,
  },
  {
    question: 'Is Runestone Construction a licensed general contractor?',
    answer:
      'Yes. Runestone Construction Corp. holds Florida certified general contractor license CGC1540643. Call 239-440-8666 to talk through a project.',
  },
  {
    question: 'How does a Runestone construction project start?',
    answer:
      'A project starts with consultation and discovery, then site evaluation, design and pre-construction coordination, permitting, construction, quality control, a final walkthrough, and project delivery.',
  },
  {
    question: 'How do I request a construction quote?',
    answer:
      'Call 239-440-8666 or use the project form on this site. Share the property, the scope, and the timeline, and the team follows up with next steps.',
  },
] as const;

type JsonLd = Record<string, unknown>;

export function absoluteUrl(path: string, origin = siteOrigin) {
  return new URL(path, origin).toString();
}

export function contractorNode(origin = siteOrigin): JsonLd {
  return {
    '@type': 'GeneralContractor',
    '@id': `${origin}/#contractor`,
    name: site.name,
    alternateName: site.shortName,
    url: origin,
    telephone: '+1-239-440-8666',
    email: site.emails[0],
    image: absoluteUrl(ogImagePath, origin),
    logo: absoluteUrl('/brand/runestone-logo.png', origin),
    description: defaultDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fort Myers',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    areaServed: site.cities.map((city) => ({
      '@type': 'City',
      name: `${city}, Florida`,
    })),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: 'Florida Certified General Contractor',
      identifier: site.license,
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Florida Department of Business and Professional Regulation',
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Construction services',
      itemListElement: site.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          areaServed: 'Southwest Florida',
          provider: { '@id': `${origin}/#contractor` },
        },
      })),
    },
  };
}

export function webPageNode(input: {
  origin?: string;
  path: string;
  title: string;
  description: string;
}): JsonLd {
  const origin = input.origin ?? siteOrigin;
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(input.path, origin)}#webpage`,
    url: absoluteUrl(input.path, origin),
    name: input.title,
    description: input.description,
    isPartOf: { '@id': `${origin}/#website` },
    about: { '@id': `${origin}/#contractor` },
    inLanguage: 'en-US',
  };
}

export function websiteNode(origin = siteOrigin): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: origin,
    name: site.shortName,
    description: defaultDescription,
    publisher: { '@id': `${origin}/#contractor` },
    inLanguage: 'en-US',
  };
}

export function faqPageNode(
  items: readonly { question: string; answer: string }[] = faqs,
): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbNode(
  origin: string,
  crumbs: { name: string; path: string }[],
): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, origin),
    })),
  };
}

export function articleNode(input: {
  origin?: string;
  path: string;
  title: string;
  description: string;
  datePublished: string;
}): JsonLd {
  const origin = input.origin ?? siteOrigin;
  return {
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    mainEntityOfPage: absoluteUrl(input.path, origin),
    author: { '@id': `${origin}/#contractor` },
    publisher: { '@id': `${origin}/#contractor` },
    image: absoluteUrl(ogImagePath, origin),
    inLanguage: 'en-US',
  };
}

export function graph(nodes: JsonLd[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
