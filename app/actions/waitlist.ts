"use server";

// ─────────────────────────────────────────────────────────────────────────────
// Waitlist Server Action — powered by Resend (https://resend.com)
//
// Setup (one-time):
//  1. Sign up free at https://resend.com
//  2. Create an API key under API Keys in the dashboard
//  3. Add to .env.local:   RESEND_API_KEY=re_xxxxxxxxxxxx
//  4. Add the same key to Vercel: Project → Settings → Environment Variables
//
// The "from" address uses Resend's shared testing domain (onboarding@resend.dev)
// which works immediately without domain verification.
// Once you verify your own domain in the Resend dashboard, change the from
// address to something like:  hello@mensolerevival.com
// ─────────────────────────────────────────────────────────────────────────────

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message?: string;
  field?: "name" | "email"; // which field triggered a validation error
};

export async function submitWaitlist(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const kit = (formData.get("kit") as string | null)?.trim() ?? "";

  // ── Validation ────────────────────────────────────────────────────────────
  if (!name) {
    return { status: "error", message: "Please enter your name.", field: "name" };
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!email || !emailOk) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
      field: "email",
    };
  }

  // ── Send via Resend API ───────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // No key configured — log locally so dev testing still works
    console.log("[Waitlist submission — no API key configured]", { name, email, kit });
    return { status: "success" };
  }

  const kitLabel = kit
    ? {
        "pain-recovery": "Pain & Recovery",
        "fungus-care": "Fungus & Nail Care",
        "alignment-mobility": "Toe Alignment & Mobility",
        "dry-skin": "Dry Skin & Cracking",
        "odor-hygiene": "Odor & Hygiene",
        "footwear-fit": "Footwear Fit",
      }[kit] ?? kit
    : "Not specified";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Change this to your verified sending domain once set up in Resend:
        from: "Men's Sole Revival <onboarding@resend.dev>",
        to: ["alfonso@barreiro.com"],
        subject: `New waitlist signup — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;color:#1a1a1a">
            <h2 style="color:#1C3F5E;margin-bottom:16px">New Waitlist Signup</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr>
                <td style="padding:8px 12px;background:#f0f7ff;font-weight:600;width:140px;border-radius:4px 0 0 4px">Name</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f0f7ff;font-weight:600">Email</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${email}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f0f7ff;font-weight:600">Kit Interest</td>
                <td style="padding:8px 12px">${kitLabel}</td>
              </tr>
            </table>
            <p style="margin-top:24px;font-size:12px;color:#9ca3af">
              Sent from mensolerevival.com
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error", res.status, body);
      return {
        status: "error",
        message: "Something went wrong sending your submission. Please try again.",
      };
    }

    return { status: "success" };
  } catch (err) {
    console.error("Waitlist action error:", err);
    return {
      status: "error",
      message: "Network error. Please check your connection and try again.",
    };
  }
}
