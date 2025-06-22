import { Suspense } from "react";
import ItemsPage from "./ItemsPage";

export default function ItemsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white" />
      </div>
    }>
      <ItemsPage />
    </Suspense>
  );
}
