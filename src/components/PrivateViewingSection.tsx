import { FormEvent, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import {
  InquiryFormData,
  InquiryValidationErrors,
  isInquiryValid,
  validateInquiryForm,
} from '../utils/inquiryValidation';

const INITIAL_FORM: InquiryFormData = {
  fullName: '',
  email: '',
  phone: '',
  preferredDate: '',
  message: '',
};

export function PrivateViewingSection() {
  const [formData, setFormData] = useState<InquiryFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<InquiryValidationErrors>({});
  const [submittedDossier, setSubmittedDossier] = useState<InquiryFormData | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateInquiryForm(formData);
    setErrors(validationErrors);
    if (!isInquiryValid(validationErrors)) {
      return;
    }
    setSubmittedDossier({ ...formData });
  };

  const updateField = (field: keyof InquiryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <section
      id="contact"
      className="bg-[#F7F4EF] text-[#171614] py-24 md:py-32 border-t border-[#D8D0C5]"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
        {/* Left Editorial Column */}
        <div className="lg:col-span-5 space-y-6">
          <p className="text-xs tracking-[0.2em] uppercase text-[#9B8364]">
            Private Viewing &amp; Dossier
          </p>
          <h2 className="font-serif text-[clamp(2.3rem,4vw,3.8rem)] leading-[1.05] font-light">
            Experience the residence in person.
          </h2>
          <p className="text-base text-[#5A5650] leading-relaxed max-w-md">
            Viewings of Villa Vérone are arranged strictly by private appointment with our senior estate principals in Saint-Jean-Cap-Ferrat.
          </p>

          <div className="pt-8 border-t border-[#D8D0C5] space-y-4 text-sm">
            <div>
              <span className="block text-xs tracking-[0.14em] uppercase text-[#5A5650]">
                Private Office
              </span>
              <span className="font-serif text-xl text-[#171614]">
                24 Boulevard du Général de Gaulle, 06230 Saint-Jean-Cap-Ferrat
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div>
                <span className="block text-xs tracking-[0.14em] uppercase text-[#5A5650]">
                  Direct Concierge
                </span>
                <span className="text-[#171614] tabular-nums">+33 4 93 00 48 12</span>
              </div>
              <div>
                <span className="block text-xs tracking-[0.14em] uppercase text-[#5A5650]">
                  Dossier Desk
                </span>
                <span className="text-[#171614]">private@villaverone.fr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inquiry Form */}
        <div className="lg:col-span-7">
          {submittedDossier ? (
            <div
              role="status"
              className="bg-[#EBE6DE] border border-[#D8D0C5] p-8 md:p-12 space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-[#9B8364]">
                <Check className="w-4 h-4" />
                <span>Private Viewing Request Received</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl font-light text-[#171614]">
                Thank you, {submittedDossier.fullName}.
              </h3>
              <p className="text-sm md:text-base text-[#5A5650] leading-relaxed max-w-xl">
                Our estate director will contact you at{' '}
                <span className="text-[#171614] font-medium">{submittedDossier.email}</span>{' '}
                to confirm architectural dossier access and private arrival arrangements for{' '}
                <span className="text-[#171614] font-medium tabular-nums">
                  {submittedDossier.preferredDate}
                </span>
                .
              </p>

              <div className="border-t border-[#D8D0C5] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5A5650]">
                <div>
                  <span className="uppercase tracking-[0.14em] block">Telephone</span>
                  <span className="text-sm text-[#171614] tabular-nums">
                    {submittedDossier.phone}
                  </span>
                </div>
                <div>
                  <span className="uppercase tracking-[0.14em] block">Preferred Date</span>
                  <span className="text-sm text-[#171614] tabular-nums">
                    {submittedDossier.preferredDate}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmittedDossier(null);
                  setFormData(INITIAL_FORM);
                  setErrors({});
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#171614] text-xs tracking-[0.14em] uppercase hover:bg-[#171614] hover:text-[#F7F4EF] transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-[#EBE6DE] border border-[#D8D0C5] p-8 md:p-12 space-y-7"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="inquiry-full-name"
                    className="block text-xs tracking-[0.14em] uppercase text-[#171614]"
                  >
                    Full Name *
                  </label>
                  <input
                    id="inquiry-full-name"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    placeholder="Claire Moreau"
                    className="w-full bg-[#F7F4EF] border border-[#C8BFB0] px-4 py-3 text-sm text-[#171614] placeholder:text-[#5A5650]/60 focus:border-[#9B8364]"
                  />
                  {errors.fullName && (
                    <p role="alert" className="text-xs text-[#8B2E2E]">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="inquiry-email"
                    className="block text-xs tracking-[0.14em] uppercase text-[#171614]"
                  >
                    Email Address *
                  </label>
                  <input
                    id="inquiry-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    placeholder="claire@atelier-moreau.fr"
                    className="w-full bg-[#F7F4EF] border border-[#C8BFB0] px-4 py-3 text-sm text-[#171614] placeholder:text-[#5A5650]/60 focus:border-[#9B8364]"
                  />
                  {errors.email && (
                    <p role="alert" className="text-xs text-[#8B2E2E]">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="inquiry-phone"
                    className="block text-xs tracking-[0.14em] uppercase text-[#171614]"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="inquiry-phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full bg-[#F7F4EF] border border-[#C8BFB0] px-4 py-3 text-sm text-[#171614] placeholder:text-[#5A5650]/60 focus:border-[#9B8364]"
                  />
                  {errors.phone && (
                    <p role="alert" className="text-xs text-[#8B2E2E]">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="inquiry-date"
                    className="block text-xs tracking-[0.14em] uppercase text-[#171614]"
                  >
                    Preferred Viewing Date *
                  </label>
                  <input
                    id="inquiry-date"
                    name="preferredDate"
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => updateField('preferredDate', e.target.value)}
                    aria-invalid={Boolean(errors.preferredDate)}
                    className="w-full bg-[#F7F4EF] border border-[#C8BFB0] px-4 py-3 text-sm text-[#171614] tabular-nums focus:border-[#9B8364]"
                  />
                  {errors.preferredDate && (
                    <p role="alert" className="text-xs text-[#8B2E2E]">
                      {errors.preferredDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="inquiry-message"
                  className="block text-xs tracking-[0.14em] uppercase text-[#171614]"
                >
                  Private Notes (Optional)
                </label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  placeholder="Specify helicopter arrival preferences, representation details, or preferred afternoon light viewing."
                  className="w-full bg-[#F7F4EF] border border-[#C8BFB0] px-4 py-3 text-sm text-[#171614] placeholder:text-[#5A5650]/60 focus:border-[#9B8364]"
                />
                {errors.message && (
                  <p role="alert" className="text-xs text-[#8B2E2E]">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[#5A5650]">
                  Confidential correspondence handled directly by Villa Vérone Private Office.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-[#171614] text-[#F7F4EF] hover:bg-[#2E2B26] transition-colors text-xs tracking-[0.16em] uppercase font-medium whitespace-nowrap shrink-0"
                >
                  <span>Request Private Viewing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
