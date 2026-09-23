"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Google Analytics and Clarity, mounted everywhere except the pages that show
 * one person's data. The progress view renders health answers and the admin
 * pages render the audience, so neither gets a page view or a session
 * recording. Analytics tags only fire on the production deployment anyway;
 * the caller decides that and passes `enabled`.
 */
const PRIVATE_PREFIXES = ["/progress", "/admin"];

export default function AnalyticsTags({
  enabled,
  gaId,
  clarityId,
}: {
  enabled: boolean;
  gaId: string;
  clarityId?: string;
}) {
  const pathname = usePathname();
  if (!enabled) return null;
  if (PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      {clarityId && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");`}
        </Script>
      )}
    </>
  );
}
