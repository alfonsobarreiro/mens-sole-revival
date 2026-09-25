import { initBotId } from "botid/client/core";

// Vercel BotID (basic mode): attaches an invisible challenge to requests for
// the routes below. The matching server check lives in app/api/ask/route.ts.
//
// The challenge script is served from a same-origin path that withBotId() in
// next.config.ts forwards to Vercel. Production builds only: the server check
// already returns HUMAN in development, so the client adds nothing locally.
if (process.env.NODE_ENV === "production") {
  initBotId({
    protect: [{ path: "/api/ask", method: "POST" }],
  });
}
