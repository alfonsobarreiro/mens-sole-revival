import { initBotId } from "botid/client/core";

// Vercel BotID (basic mode): attaches an invisible challenge to requests for
// the routes below. The matching server check lives in app/api/ask/route.ts.
//
// Production builds only. The challenge script is proxied to Vercel and needs
// a deployment behind it, so on localhost it can only 404; the client then
// waits on that failed load before sending any protected request, and a slow
// upstream turns the wait into a hang. The server check already returns
// HUMAN in development, so nothing is lost by skipping the client here.
if (process.env.NODE_ENV === "production") {
  initBotId({
    protect: [{ path: "/api/ask", method: "POST" }],
  });
}
