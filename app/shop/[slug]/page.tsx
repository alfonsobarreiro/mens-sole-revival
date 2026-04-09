import { redirect } from "next/navigation";

// Shop detail pages are not part of the educational site model.
// Redirect to the Learn section.
export default function ProductPage() {
  redirect("/learn");
}
