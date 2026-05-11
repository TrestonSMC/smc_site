export default function AccountDeletionPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#05070B",
        color: "white",
        padding: "48px 24px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "16px" }}>
          Account Deletion
        </h1>

        <p style={{ fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "16px" }}>
          If you created an account in the SMC app, you can request deletion of
          your account and associated data from inside the app by going to
          Settings and selecting Delete Account.
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "16px" }}>
          You may also request deletion help by contacting
          {" "}support@slatermediacompany.com.
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
          When your deletion request is processed, your account and associated
          profile data will be permanently deleted. Certain information may be
          retained where required for legal, accounting, security,
          fraud-prevention, or compliance purposes.
        </p>
      </div>
    </main>
  );
}