import { BrandMark } from "@/components/BrandMark";
import { GuestOnly } from "@/components/GuestOnly";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <GuestOnly>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-sm flex-col items-center gap-8">
          <BrandMark size="lg" />
          {children}
          <p className="text-center text-sm text-muted">
            Un pequeño paso cada día. Rachas lleva la cuenta por ti.
          </p>
        </div>
      </main>
    </GuestOnly>
  );
}
