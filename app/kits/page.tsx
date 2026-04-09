import { redirect } from "next/navigation";

// Kits replaced by Routines in the educational model
export default function KitsPage() {
  redirect("/routines");
}
