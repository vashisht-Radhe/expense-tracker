import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <div>
      <Toaster position="top-right" />
      <AppRoutes />
    </div>
  );
};

export default App;
