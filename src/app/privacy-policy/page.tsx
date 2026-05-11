import Link from "next/link";

const LOGO_BLUE = "#2a8bff";

const sections = [
  {
    title: "1. Introduction",
    body: [
      "Welcome to Slater Media Company (“SMC”, “we”, “our”, or “us”). We respect your privacy and are committed to protecting the information you share with us.",
      "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, submit a form, apply for opportunities, or otherwise interact with our services online.",
    ],
  },
  {
    title: "2. Information We Collect",
    body: [
      "We may collect personal information you voluntarily provide to us, including your name, email address, phone number, company or organization name, and any other details you submit through contact forms, inquiry forms, application forms, or uploads.",
      "We may also automatically collect certain technical information such as your IP address, browser type, device type, operating system, pages viewed, time spent on pages, and referring website information.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: [
      "We may use the information we collect to respond to inquiries, communicate with you, provide requested services, review submissions or applications, improve our website and offerings, monitor website performance, and maintain the security of our systems.",
      "Where applicable, we may also use your information to send updates, service-related notices, or marketing communications, subject to your preferences and applicable law.",
    ],
  },
  {
    title: "4. Sharing of Information",
    body: [
      "We do not sell your personal information.",
      "We may share information with trusted service providers and partners that help us operate our website, host content, process submissions, manage communications, analyze website performance, or support our business operations.",
      "We may also disclose information if required to do so by law, legal process, or to protect the rights, property, or safety of Slater Media Company, our users, or others.",
    ],
  },
  {
    title: "5. Cookies and Analytics",
    body: [
      "Our website may use cookies, analytics tools, and similar technologies to understand traffic patterns, improve functionality, and enhance user experience.",
      "These technologies may collect information about your interaction with our site. You can usually control or disable cookies through your browser settings.",
    ],
  },
  {
    title: "6. Data Retention",
    body: [
      "We retain personal information for as long as reasonably necessary to fulfill the purposes described in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce agreements.",
    ],
  },
  {
    title: "7. Data Security",
    body: [
      "We use reasonable administrative, technical, and organizational safeguards to protect personal information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "8. Your Choices and Rights",
    body: [
      "Depending on your location and applicable law, you may have the right to request access to the personal information we hold about you, request correction or deletion, or opt out of certain communications.",
      "To make a privacy-related request, please contact us using the contact information listed below.",
    ],
  },
  {
    title: "9. Third-Party Links",
    body: [
      "Our website may contain links to third-party websites or services. We are not responsible for the privacy practices, content, or security of those third parties.",
    ],
  },
  {
    title: "10. Children’s Privacy",
    body: [
      "Our website and services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13.",
    ],
  },
  {
    title: "11. Changes to This Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time. Any updates will be posted on this page with a revised effective date.",
    ],
  },
  {
    title: "12. Contact Us",
    body: [
      "If you have questions about this Privacy Policy or would like to make a request regarding your information, please contact us at support@slatermediacompany.com.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#05070B] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(42,139,255,0.16),transparent_38%),linear-gradient(180deg,#08101c_0%,#05070B_65%,#05070B_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.08]" />
        <div
          className="absolute left-1/2 top-0 h-[380px] w-[380px] -translate-x-1/2 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: LOGO_BLUE }}
        />

        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-28 sm:px-8 sm:pt-32">
          <Link
            href="/"
            className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            ← Back to Home
          </Link>

          <div className="max-w-3xl">
            <div
              className="mb-4 inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/80"
              style={{
                borderColor: "rgba(42,139,255,0.35)",
                backgroundColor: "rgba(42,139,255,0.12)",
                boxShadow: "0 0 30px rgba(42,139,255,0.18)",
              }}
            >
              Legal
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              This page explains how Slater Media Company collects, uses, and
              protects information provided through our website and digital
              services.
            </p>

            <div className="mt-8 flex flex-col gap-2 text-sm text-white/55 sm:flex-row sm:items-center sm:gap-6">
              <span>Effective Date: April 16, 2026</span>
              <span className="hidden sm:inline">•</span>
              <span>Last Updated: April 16, 2026</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-6">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
              >
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-7 text-white/72 sm:text-[15px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <p className="mt-3 text-sm leading-7 text-white/70 sm:text-[15px]">
              Slater Media Company
              <br />
              Email:{" "}
              <a
                href="mailto:support@slatermediacompany.com"
                className="text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white/60"
              >
                support@slatermediacompany.com
              </a>
              <br />
              Website:{" "}
              <a
                href="https://www.slatermediacompany.com"
                target="_blank"
                rel="noreferrer"
                className="text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white/60"
              >
                www.slatermediacompany.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}