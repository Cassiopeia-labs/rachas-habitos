import { AppHeader } from "@/components/AppHeader";
import { HabitsPlaceholder } from "@/components/HabitsPlaceholder";
import { RequireAuth } from "@/components/RequireAuth";

export default function HomePage() {
  return (
    <RequireAuth>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Tus hábitos
        </h1>
        <HabitsPlaceholder />
      </main>
    </RequireAuth>
  );
}
