// app/page.tsx

import HomePage from "@/pages/pages/Home"; // Stellen Sie sicher, dass der Pfad korrekt ist
import "@/pages/components/Layout/tailwindStyles"; // Stellen Sie sicher, dass der Pfad korrekt ist

export default function App() {
  return (
    <main>
      <HomePage minimizedSidebar={true} />
    </main>
  );
}
