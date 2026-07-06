/**
 * Background Service Worker
 *
 * Thin message router — delegates Odoo logic to odoo-client.ts.
 */

import type { OdooTicketPayload, OdooCredentials } from "../shared/types";
import { handleCreateOdooTicket } from "./odoo-client";

// ─── Message listener ────────────────────────────────────────────────────────────

interface IncomingMessage {
  type: string;
  payload?: OdooTicketPayload;
}

chrome.runtime.onMessage.addListener(
  (request: IncomingMessage, _sender, sendResponse) => {
    if (request.type === "CREATE_ODOO_TICKET") {
      if (!request.payload) {
        sendResponse({ success: false, error: "Missing payload" });
        return true;
      }
      void handleCreateOdooTicket(request.payload).then(sendResponse);
      return true; // keep channel open for async response
    }

    if (request.type === "GET_ODOO_AUTH_STATUS") {
      void chrome.storage.local.get(["odooEmail", "odooApiKey"]).then((stored) => {
        const s = stored as Partial<OdooCredentials>;
        sendResponse({ loggedIn: !!(s.odooEmail && s.odooApiKey), email: s.odooEmail ?? null });
      });
      return true;
    }

    return false;
  }
);
