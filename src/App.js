import "./App.css";
import AppRoutes from "./components/AppRoutes";
import Layout from "./components/Layout";
function App() {
  return (
    <div
      className=""
      style={{
        background: "#276ca1",
        minHeight: "100vh",
        height: "max-content",
      }}
    >
      <AppRoutes />
    </div>
  );
}

export default App;
