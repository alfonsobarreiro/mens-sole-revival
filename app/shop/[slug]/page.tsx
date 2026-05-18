import { redirect } from "next/navigation";

// Shop detail pages are not part of the educational site model.
// Redirect to the Guides section.
export default function ProductPage() {
  redirect("/guides");
}
