export function redirectIfNotAuthenticated(
  handler: (arg0: any, arg1: any) => any
) {
  return (
    req: any,
    res: {
      writeHead: (arg0: number, arg1: { Location: string }) => void;
      end: () => void;
    }
  ) => {
    // Überprüfe hier, ob der Benutzer authentifiziert ist.
    // Du kannst den Authentifizierungsstatus aus dem Request oder aus deinem Authentifizierungs-Context heraus überprüfen.

    // Beispiel:
    const isAuthenticated = false; // Hier sollte deine Logik zur Überprüfung der Authentifizierung stehen.

    if (!isAuthenticated) {
      res.writeHead(302, { Location: "/login" }); // Weiterleitung zur Login-Seite
      res.end();
      return;
    }

    return handler(req, res);
  };
}
