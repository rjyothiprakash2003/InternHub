type EmailPayload = {
  to: string;
  template: string;
  variables: Record<string, string>;
};

const TEMPLATES: Record<string, { subject: string; body: string }> = {
  welcome: {
    subject: "Welcome to InternHub, {{student_name}}",
    body: "Hello {{student_name}}, your InternHub account is ready. Explore internships and start your career journey.",
  },
  registration: {
    subject: "Registration confirmed",
    body: "Hi {{student_name}}, your InternHub registration was successful.",
  },
  application_confirmation: {
    subject: "Application received — {{internship_domain}}",
    body: "Hello {{student_name}}, we received your application for {{internship_domain}} ({{duration}}).",
  },
  payment_confirmation: {
    subject: "Payment confirmed",
    body: "Hello {{student_name}}, your payment for {{internship_domain}} was successful.",
  },
  application_approval: {
    subject: "Application approved",
    body: "Hello {{student_name}}, your {{internship_domain}} application has been approved. Duration: {{duration}}. Start: {{start_date}}. End: {{end_date}}.",
  },
  offer_letter: {
    subject: "Your InternHub offer letter is ready",
    body: "Hello {{student_name}}, offer letter {{offer_letter_id}} is available in your documents.",
  },
  internship_start: {
    subject: "Internship starting soon",
    body: "Hello {{student_name}}, your {{internship_domain}} internship starts on {{start_date}}.",
  },
  completion: {
    subject: "Internship completed",
    body: "Hello {{student_name}}, your internship from {{start_date}} to {{end_date}} is marked complete.",
  },
  certificate_available: {
    subject: "Certificate available",
    body: "Hello {{student_name}}, certificate {{certificate_id}} is ready to download and verify.",
  },
  password_reset: {
    subject: "Reset your InternHub password",
    body: "Hello {{student_name}}, use the password reset flow in InternHub to create a new password.",
  },
};

function interpolate(template: string, variables: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? "");
}

export async function sendTemplatedEmail(payload: EmailPayload) {
  const template = TEMPLATES[payload.template];
  if (!template) return { queued: false, reason: "unknown_template" };
  const subject = interpolate(template.subject, payload.variables);
  const body = interpolate(template.body, payload.variables);

  if (!process.env.RESEND_API_KEY) {
    console.info("[email:demo]", { to: payload.to, subject, body });
    return { queued: true, provider: "console" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: payload.to,
      subject,
      text: body,
    }),
  });
  return { queued: res.ok, provider: "resend" };
}
