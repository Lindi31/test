// app/page.tsx

import HomePage from "@/app/dashboard/Home"; // Stellen Sie sicher, dass der Pfad korrekt ist
import "@/app/sidebar/tailwindStyles"; // Stellen Sie sicher, dass der Pfad korrekt ist

export default function App() {
  return (
    <main>
      <HomePage minimizedSidebar={true} />
    </main>
  );
}
