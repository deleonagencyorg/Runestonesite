export const site = {
  name: 'Runestone Construction Corp.',
  shortName: 'Runestone Construction',
  phone: '239-440-8666',
  phoneHref: 'tel:+12394408666',
  emails: [
    'Runestoneconstructioncorp@gmail.com',
    'Alejandro.Perez@Runestonehomes.com',
    'Alejandro.Perez@Runestonedevelopment.com',
  ],
  license: 'CGC1540643',
  area: 'Southwest Florida',
  cities: [
    'Naples',
    'Fort Myers',
    'Cape Coral',
    'Estero',
    'Bonita Springs',
    'Marco Island',
    'Punta Gorda',
    'Port Charlotte',
    'Immokalee',
  ] as const,
  services: [
    {
      slug: 'residential',
      title: 'Custom Residential Construction',
      summary:
        'From contemporary custom homes to sophisticated residential projects, we manage the building process from pre-construction through completion.',
    },
    {
      slug: 'multifamily',
      title: 'Multifamily Construction',
      summary:
        'Construction and project coordination for duplex, triplex, quadplex, and larger multifamily development opportunities.',
    },
    {
      slug: 'commercial',
      title: 'Commercial Construction',
      summary:
        'General contracting for commercial projects from new construction to tenant improvements and specialized build-outs.',
    },
    {
      slug: 'construction-management',
      title: 'Construction Management',
      summary:
        'Oversight throughout the building process: subcontractors, materials, scheduling, inspections, quality control, and communication.',
    },
  ] as const,
  process: [
    {
      num: '01',
      title: 'Consultation & Project Discovery',
      description:
        'Every project begins with understanding the client’s goals, vision, property, scope, budget, timeline, and unique requirements.',
    },
    {
      num: '02',
      title: 'Site Evaluation & Feasibility',
      description:
        'We evaluate zoning, setbacks, utilities, drainage, access, and coordinate with design professionals when needed.',
    },
    {
      num: '03',
      title: 'Design & Pre-Construction',
      description:
        'Architectural and engineering coordination, materials, finishes, preliminary costs, and major specifications.',
    },
    {
      num: '04',
      title: 'Permitting & Approvals',
      description:
        'We coordinate permitting with design professionals and local authorities to keep the project moving efficiently.',
    },
    {
      num: '05',
      title: 'Construction',
      description:
        'Subcontractors, materials, inspections, scheduling, and jobsite operations with ongoing client communication.',
    },
    {
      num: '06',
      title: 'Quality Control & Inspections',
      description:
        'Workmanship review at critical stages and required inspections against plans, codes, and specifications.',
    },
    {
      num: '07',
      title: 'Final Walkthrough & Completion',
      description:
        'Detailed final review, remaining items, final inspections, and preparation for turnover.',
    },
    {
      num: '08',
      title: 'Project Delivery',
      description:
        'Official delivery defined by professionalism, communication, and quality from beginning to end.',
    },
  ] as const,
};

export type Locale = 'en' | 'es';

export function localizedPath(path: string, locale: Locale = 'en') {
  if (locale === 'en') return path === '' ? '/' : path;
  const clean = path === '/' ? '' : path;
  return `/es${clean}`;
}
