
import { use } from "react";
import WorldCategoryPageClient from "./page-client";

type Params = Promise<{ category: string }>;

export default function WorldCategoryPageWrapper(props: { params: Params }) {
  const params = use(props.params);

  return <WorldCategoryPageClient params={params} />;
}
