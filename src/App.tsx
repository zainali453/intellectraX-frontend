import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import { AuthRoutes } from "./routes/AuthRoutes.tsx";
import { TeacherRoutes } from "./routes/TeacherRoutes.tsx";
import { ParentRoutes } from "./routes/ParentRoutes.tsx";
import { StudentRoutes } from "./routes/StudentRoutes.tsx";
import { AdminRoutes } from "./routes/AdminRoutes.tsx";

function App() {
  return (
    <UserProvider>
      <Routes>
        {AuthRoutes}
        {TeacherRoutes}
        {ParentRoutes}
        {StudentRoutes}
        {AdminRoutes}
        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
