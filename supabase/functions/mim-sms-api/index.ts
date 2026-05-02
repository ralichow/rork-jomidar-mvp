// Supabase Edge Function: mim-sms-api
// Registered as an Auth Hook (Send SMS, HTTPS type).
// Supabase signs each request with HMAC-SHA256 (Svix format).
// This function verifies the signature, then forwards the OTP via MiMSMS.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const MIMSMS_API_URL = "https://api.mimsms.com/api/SmsSending/SMS";
const MIMSMS_USERNAME = "tazwarmohammed1998@gmail.com";
const MIMSMS_SENDER = "MiM Digital";

// ── Svix-style HMAC-SHA256 signature verification ─────────────────────────
// Supabase sends:
//   webhook-id        unique message id
//   webhook-timestamp unix seconds
//   webhook-signature v1,<base64-hmac> (space-separated if multiple)
// Signed payload: "<webhook-id>.<webhook-timestamp>.<raw-body>"
async function verifyHook(req: Request, secretB64: string): Promise<{ ok: boolean; body: string }> {
  const webhookId = req.headers.get("webhook-id");
  const webhookTimestamp = req.headers.get("webhook-timestamp");
  const webhookSignature = req.headers.get("webhook-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return { ok: false, body: "" };
  }

  // Reject stale requests (±5 minutes)
  const ts = parseInt(webhookTimestamp, 10);
  if (isNaN(ts) || Math.abs(Date.now() / 1000 - ts) > 300) {
    return { ok: false, body: "" };
  }

  const body = await req.text();
  const toSign = `${webhookId}.${webhookTimestamp}.${body}`;

  // Decode the base64 secret (HOOK_SECRET env var stores only the base64 part)
  const secretBytes = Uint8Array.from(atob(secretB64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(toSign)
  );
  const expectedSig = `v1,${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;

  // Header may contain multiple space-separated signatures
  const ok = webhookSignature.split(" ").some((s) => s === expectedSig);
  return { ok, body };
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // ── Retrieve secrets ───────────────────────────────────────────────────────
  const apiKey = Deno.env.get("MIMSMS_API_KEY");
  if (!apiKey) {
    console.error("MIMSMS_API_KEY secret is not set");
    return json({ error: "SMS service not configured" }, 500);
  }

  const hookSecret = Deno.env.get("HOOK_SECRET");
  if (!hookSecret) {
    console.error("HOOK_SECRET secret is not set");
    return json({ error: "Hook not configured" }, 500);
  }

  // ── Verify Supabase Auth hook signature ────────────────────────────────────
  const { ok, body } = await verifyHook(req, hookSecret);
  if (!ok) {
    console.error("Webhook signature verification failed");
    return json({ error: "Unauthorized" }, 401);
  }

  // ── Parse hook payload ─────────────────────────────────────────────────────
  let payload: { user?: { phone?: string }; sms?: { otp?: string } };
  try {
    payload = JSON.parse(body);
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const phone = payload?.user?.phone ?? "";
  const otp = payload?.sms?.otp ?? "";

  if (!phone || !otp) {
    return json({ error: "Missing phone or otp in hook payload" }, 400);
  }

  // ── Convert E.164 (+8801XXXXXXXXX) → MiMSMS format (8801XXXXXXXXX) ─────────
  const mobileNumber = phone.startsWith("+") ? phone.slice(1) : phone;

  const message =
    `Your Jomidar verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

  const smsPayload = {
    UserName: MIMSMS_USERNAME,
    Apikey: apiKey,
    MobileNumber: mobileNumber,
    CampaignId: "null",
    SenderName: MIMSMS_SENDER,
    TransactionType: "T",
    Message: message,
  };

  // ── Send SMS ───────────────────────────────────────────────────────────────
  try {
    debugger;
    const smsRes = await fetch(MIMSMS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(smsPayload),
    });

    if (!smsRes.ok) {
      console.error("MiMSMS HTTP error:", smsRes.status);
      return json({ error: "SMS service returned an error" }, 502);
    }

    const smsData: {
      statusCode?: string;
      status?: string;
      trxnId?: string;
      responseResult?: string;
    } = await smsRes.json();

    if (smsData.statusCode !== "200" || smsData.status !== "Success") {
      console.error("MiMSMS rejection:", smsData);
      return json(
        { error: "Failed to send SMS", detail: smsData.responseResult },
        502
      );
    }

    console.log("SMS sent via MiMSMS:", {
      trxnId: smsData.trxnId,
      mobile: mobileNumber,
    });

    // Supabase Auth Hook expects an empty object on success.
    return json({}, 200);
  } catch (err) {
    console.error("MiMSMS fetch error:", err);
    return json({ error: "SMS service unreachable" }, 503);
  }
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
