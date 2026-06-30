import LegalLayout from "@/components/shared/LegalLayout";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <LegalLayout title="Terms of Service" lastUpdated="March 15, 2026">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using PlannerHQ, you agree to be bound by these Terms. If you're using on
          behalf of an organization, you represent that you have authority to bind them.
        </p>

        <h2>2. Account & Workspaces</h2>
        <p>
          You are responsible for maintaining the security of your account. Workspace owners control
          permissions and access. You must comply with all applicable laws.
        </p>

        <h2>3. Subscriptions & Billing</h2>
        <p>
          Paid plans are billed in advance on a monthly or yearly basis. You can cancel anytime,
          and no further charges will be made. Refunds are handled per our refund policy.
        </p>

        <h2>4. AI Features</h2>
        <p>
          Our AI assistant generates suggestions based on your content. You retain full ownership of
          any output. We are not liable for AI-generated decisions.
        </p>

        <h2>5. User Content</h2>
        <p>
          You own all content you create in PlannerHQ. We do not claim ownership, and we only process
          content to provide the service.
        </p>

        <h2>6. Termination</h2>
        <p>
          Either party may terminate at any time. Upon termination, you can export your data within
          30 days. After that, data may be deleted.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, PlannerHQ is not liable for indirect damages or
          lost profits arising from use of the service.
        </p>

        <h2>8. Contact</h2>
        <p>
          Questions about these Terms? Reach us at <a href="mailto:legal@plannerhq.com">legal@plannerhq.com</a>.
        </p>
      </LegalLayout>
      <Footer />
    </>
  );
}