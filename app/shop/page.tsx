import { redirect } from "next/navigation";

// Shop is not part of the educational site model.
// Redirect to the Learn section.
export default function ShopPage() {
  redirect("/guides");
}
