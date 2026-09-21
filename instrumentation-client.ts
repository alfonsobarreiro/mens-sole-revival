import { initBotId } from "botid/client/core";

// Vercel BotID (basic mode): attaches an invisible challenge to requests for
// the routes below. The matching server check lives in app/api/ask/route.ts.
initBotId({
  protect: [{ path: "/api/ask", method: "POST" }],
});
