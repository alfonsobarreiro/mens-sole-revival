import { redirect } from "next/navigation";

// /blog listing consolidated into /learn
export default function BlogPage() {
  redirect("/learn");
}
