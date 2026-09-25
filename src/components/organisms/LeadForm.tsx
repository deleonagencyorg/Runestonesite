import { useState } from 'preact/hooks';

export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType:
    | 'residential'
    | 'multifamily'
    | 'commercial'
    | 'construction-management'
    | 'other';
  location?: string;
  budgetRange?: string;
  timeline?: string;
  preferredContact: 'phone' | 'email' | 'either';
  message: string;
  consent: true;
  source: string;
  locale: 'en' | 'es';
  website?: string; // honeypot
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const empty = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: 'residential' as const,
  location: '',
  budgetRange: '',
  timeline: '',
  preferredContact: 'either' as const,
  message: '',
  consent: false,
  website: '',
};

type Props = {
  locale?: 'en' | 'es';
};

export default function LeadForm({ locale = 'en' }: Props) {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  function update<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: Event) {
    e.preventDefault();
    if (form.website) return;
    if (!form.consent) {
      setError('Please accept the consent checkbox.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setError('');

    const payload: LeadPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim() || undefined,
      projectType: form.projectType,
      location: form.location.trim() || undefined,
      budgetRange: form.budgetRange.trim() || undefined,
      timeline: form.timeline.trim() || undefined,
      preferredContact: form.preferredContact,
      message: form.message.trim(),
      consent: true,
      source:
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '/',
      locale,
    };

    const api = import.meta.env.PUBLIC_LEADS_API_URL as string | undefined;

    try {
      if (!api) {
        console.info('[leads:mock]', payload);
        setStatus('success');
        setForm(empty);
        return;
      }

      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus('success');
      setForm(empty);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <form class="lead-form" data-testid="lead-form" onSubmit={onSubmit} noValidate>
      <div class="grid">
        <label>
          Name *
          <input
            required
            name="name"
            value={form.name}
            onInput={(e) => update('name', (e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Email *
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onInput={(e) => update('email', (e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Phone *
          <input
            required
            type="tel"
            name="phone"
            value={form.phone}
            onInput={(e) => update('phone', (e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Company
          <input
            name="company"
            value={form.company}
            onInput={(e) => update('company', (e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Project type *
          <select
            name="projectType"
            value={form.projectType}
            onChange={(e) =>
              update('projectType', (e.target as HTMLSelectElement).value as typeof form.projectType)
            }
          >
            <option value="residential">Custom Residential</option>
            <option value="multifamily">Multifamily</option>
            <option value="commercial">Commercial</option>
            <option value="construction-management">Construction Management</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Location / City
          <input
            name="location"
            value={form.location}
            onInput={(e) => update('location', (e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Budget range
          <input
            name="budgetRange"
            value={form.budgetRange}
            onInput={(e) => update('budgetRange', (e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Timeline
          <input
            name="timeline"
            value={form.timeline}
            onInput={(e) => update('timeline', (e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Preferred contact *
          <select
            name="preferredContact"
            value={form.preferredContact}
            onChange={(e) =>
              update(
                'preferredContact',
                (e.target as HTMLSelectElement).value as typeof form.preferredContact,
              )
            }
          >
            <option value="either">Either</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
          </select>
        </label>
      </div>

      <label class="full">
        Message *
        <textarea
          required
          name="message"
          rows={5}
          value={form.message}
          onInput={(e) => update('message', (e.target as HTMLTextAreaElement).value)}
        />
      </label>

      <label class="consent">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update('consent', (e.target as HTMLInputElement).checked)}
        />
        I agree to be contacted about my project.
      </label>

      <label class="hp" aria-hidden="true">
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          name="website"
          value={form.website}
          onInput={(e) => update('website', (e.target as HTMLInputElement).value)}
        />
      </label>

      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Let’s Build Something Exceptional'}
      </button>

      {status === 'success' && (
        <p class="ok" role="status" data-testid="lead-success">
          Thank you. Our team will contact you about next steps.
        </p>
      )}
      {status === 'error' && (
        <p class="err" role="alert" data-testid="lead-error">
          {error || 'Unable to send. Please call us.'}
        </p>
      )}

      <style>{`
        .lead-form {
          display: grid;
          gap: 1rem;
        }
        .grid {
          display: grid;
          gap: 1rem;
        }
        @media (min-width: 700px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        label {
          display: grid;
          gap: 0.35rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .full { grid-column: 1 / -1; }
        input, select, textarea {
          font: inherit;
          padding: 0.75rem 0.85rem;
          border: 1px solid #cfc8bf;
          background: #fff;
          color: #1a1a1a;
        }
        .consent {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-weight: 400;
        }
        .consent input { width: auto; margin-top: 0.2rem; }
        .hp {
          position: absolute;
          left: -9999px;
          height: 0;
          overflow: hidden;
        }
        button {
          justify-self: start;
          padding: 0.95rem 1.4rem;
          border: 0;
          background: #8b1e1e;
          color: #faf9f7;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
        }
        button:disabled { opacity: 0.7; cursor: wait; }
        .ok { color: #1f6b3a; }
        .err { color: #8b1e1e; }
      `}</style>
    </form>
  );
}
