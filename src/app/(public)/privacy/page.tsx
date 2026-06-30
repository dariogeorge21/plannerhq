import LegalLayout from "@/components/shared/LegalLayout";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <LegalLayout title="Privacy Policy" lastUpdated="March 15, 2026">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as your name, email address,
          payment information, and workspace content. We also automatically collect usage data
          (e.g., pages viewed, collaboration events) to improve our service.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information to provide, maintain, and improve PlannerHQ, to communicate with you,
          and to develop new features. Your workspace content is never used to train our AI models
          without explicit consent.
        </p>

        <h2>3. AI & Data Training</h2>
        <p>
          PlannerHQ's AI features use large language models. We do <strong>not</strong> use customer
          workspace content to train or improve our AI models unless you opt in. Any training data
          is anonymized and stripped of personal identifiers.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement industry-standard encryption (AES-256 at rest, TLS 1.3 in transit), regular
          security audits, and strict access controls. For Enterprise customers, we offer additional
          security features like SSO and audit logs.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>
          We integrate with Google Calendar, Meet, and other tools. These services have their own
          privacy policies, and you control which integrations to enable.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You can access, correct, export, or delete your personal data at any time. For any
          privacy requests, contact <a href="mailto:privacy@plannerhq.com">privacy@plannerhq.com</a>.
        </p>
      </LegalLayout>
      <Footer />
    </>
  );
}