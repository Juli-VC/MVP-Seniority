import "bootstrap/dist/css/bootstrap.min.css";
import { SeniorityProvider } from "./context/SeniorityProvider";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <SeniorityProvider>
      <AppRoutes />
    </SeniorityProvider>
  );
}

export default App;
