import { Header } from "@/components/header";
import { Composer } from "@/components/composer";
import { Feed } from "@/components/feed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-6">
        <Composer />
        <Feed />
      </main>
    </div>
  );
}
