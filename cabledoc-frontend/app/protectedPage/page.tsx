// pages/protectedPage.tsx
import { useRequireAuth } from "../useRequireAuth";

const ProtectedPage = () => {
  useRequireAuth(); // Redirects to login if user is not authenticated

  return <div>Protected Content</div>;
};

export default ProtectedPage;
