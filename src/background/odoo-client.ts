/**
 * Odoo JSON-RPC Client
 *
 * All Odoo API interactions isolated here.
 * Imported by the Service Worker to handle CREATE_ODOO_TICKET requests.
 *
 * Flow:
 *   1. authenticate
 *   2. search/create res.partner
 *   3. search/create helpdesk.tag
 *   4. create helpdesk.ticket   ← must succeed before steps 5–6
 *   5. send mail (conversation text) via mail.compose.message
 *   6. change stage to Solved
 */

import type { OdooTicketPayload, OdooTicketResult, OdooCredentials } from "../shared/types";

// ─── Config (build-time, non-sensitive) ────────────────────────────────────────

const ODOO_URL = (import.meta.env.VITE_ODOO_URL as string) || "https://hrm.mindx.edu.vn";
const ODOO_DB = (import.meta.env.VITE_ODOO_DB as string) || "mindxhrm";
const ODOO_TEAM_ID = Number(import.meta.env.VITE_ODOO_TEAM_ID ?? 1);
const ODOO_SOLVED_STAGE_ID = Number(import.meta.env.VITE_ODOO_SOLVED_STAGE_ID ?? 4);

const JSONRPC_URL = `${ODOO_URL.replace(/\/+$/, "")}/jsonrpc`;
const TIMEOUT_MS = 30_000;

/** Auto-incrementing request ID — unique per call, safe for future concurrent use. */
let _rpcIdCounter = 0;
function nextRpcId(): number { return ++_rpcIdCounter; }

// ─── JSON-RPC helper ────────────────────────────────────────────────────────────

interface JsonRpcPayload {
  service: string;
  method: string;
  args: unknown[];
}

async function jsonrpc(payload: JsonRpcPayload, id: number): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(JSONRPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: payload,
        id,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json() as { result?: unknown; error?: { message?: string; data?: { message?: string } } };
    if (data.error) {
      const msg = data.error.data?.message || data.error.message || JSON.stringify(data.error);
      throw new Error(`Odoo error: ${msg}`);
    }

    return data.result;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timeout (30s)");
    }
    throw err;
  }
}

// ─── Odoo operations ────────────────────────────────────────────────────────────

async function authenticate(email: string, apiKey: string): Promise<number> {
  const uid = await jsonrpc(
    { service: "common", method: "authenticate", args: [ODOO_DB, email, apiKey, {}] },
    nextRpcId()
  );
  if (!uid || typeof uid !== "number") {
    throw new Error("Xác thực Odoo thất bại — kiểm tra lại email và API Key.");
  }
  return uid;
}

function executeKw(
  uid: number,
  apiKey: string,
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {},
  id: number
): Promise<unknown> {
  return jsonrpc(
    {
      service: "object",
      method: "execute_kw",
      args: [ODOO_DB, uid, apiKey, model, method, args, kwargs],
    },
    id
  );
}

async function findOrCreatePartner(
  uid: number,
  apiKey: string,
  name: string,
  phone: string,
  email: string
): Promise<number> {
  const partners = await executeKw(
    uid, apiKey, "res.partner", "search_read",
    [[["name", "=", name]]],
    { fields: ["id"], limit: 1 },
    nextRpcId()
  ) as { id: number }[];

  if (partners && partners.length > 0) {
    return partners[0].id;
  }

  const partnerId = await executeKw(
    uid, apiKey, "res.partner", "create",
    [{ name, phone, email }],
    {},
    nextRpcId()
  );
  return partnerId as number;
}

async function findOrCreateTag(
  uid: number,
  apiKey: string,
  tagName: string
): Promise<number> {
  const tags = await executeKw(
    uid, apiKey, "helpdesk.tag", "search_read",
    [[["name", "=", tagName]]],
    { fields: ["id"], limit: 1 },
    nextRpcId()
  ) as { id: number }[];

  if (tags && tags.length > 0) {
    return tags[0].id;
  }

  const tagId = await executeKw(
    uid, apiKey, "helpdesk.tag", "create",
    [{ name: tagName }],
    {},
    nextRpcId()
  );
  return tagId as number;
}

async function createTicket(
  uid: number,
  apiKey: string,
  title: string,
  description: string,
  partnerId: number,
  tagId: number,
  partnerEmail: string
): Promise<number> {
  const ticketId = await executeKw(
    uid, apiKey, "helpdesk.ticket", "create",
    [{
      name: title,
      description,
      partner_id: partnerId,
      partner_email: partnerEmail,
      team_id: ODOO_TEAM_ID,
      tag_ids: [[4, tagId]],
    }],
    {},
    nextRpcId()
  );

  if (!ticketId || typeof ticketId !== "number") {
    throw new Error("Tạo ticket thất bại — không nhận được ticket ID từ Odoo.");
  }

  return ticketId;
}

async function sendMailToTicket(
  uid: number,
  apiKey: string,
  ticketId: number,
  conversationText: string
): Promise<void> {
  // Escape HTML special chars, convert newlines to <br/> — mirrors sendMail_simple.py
  const body = conversationText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br/>");

  const wizardId = await executeKw(
    uid, apiKey, "mail.compose.message", "create",
    [{
      model: "helpdesk.ticket",
      res_ids: [ticketId],
      body,
      composition_mode: "comment",
      message_type: "comment",
    }],
    {},
    nextRpcId()
  ) as number;

  await executeKw(
    uid, apiKey, "mail.compose.message", "action_send_mail",
    [[wizardId]],
    {},
    nextRpcId()
  );
}

async function changeStageToSolved(
  uid: number,
  apiKey: string,
  ticketId: number
): Promise<void> {
  await executeKw(
    uid, apiKey, "helpdesk.ticket", "write",
    [[ticketId], { stage_id: ODOO_SOLVED_STAGE_ID }],
    {},
    nextRpcId()
  );
}

// ─── Exported handler ────────────────────────────────────────────────────────────

export async function handleCreateOdooTicket(payload: OdooTicketPayload): Promise<OdooTicketResult> {
  // 1. Load credentials from storage
  const stored = await chrome.storage.local.get(["odooEmail", "odooApiKey"]) as Partial<OdooCredentials>;
  if (!stored.odooEmail || !stored.odooApiKey) {
    return { success: false, error: "NOT_LOGGED_IN" };
  }

  const { odooEmail, odooApiKey } = stored as OdooCredentials;

  try {
    // 2. Authenticate
    const uid = await authenticate(odooEmail, odooApiKey);

    // 3. Resolve partner & tag (can run in parallel)
    const [partnerId, tagId] = await Promise.all([
      findOrCreatePartner(uid, odooApiKey, payload.customerName, payload.phone, payload.email),
      findOrCreateTag(uid, odooApiKey, payload.tagName),
    ]);

    // 4. Create ticket — MUST succeed before steps 5 & 6
    const ticketId = await createTicket(
      uid, odooApiKey,
      payload.title,
      payload.description,
      partnerId,
      tagId,
      payload.email
    );

    // 5. Send mail with conversation text (ticket already exists at this point)
    await sendMailToTicket(uid, odooApiKey, ticketId, payload.conversationText);

    // 6. Change stage to Solved
    await changeStageToSolved(uid, odooApiKey, ticketId);

    return { success: true, ticketId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[OdooClient] createOdooTicket error:", err);
    return { success: false, error: msg };
  }
}
