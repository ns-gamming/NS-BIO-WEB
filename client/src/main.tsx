import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { analytics } from "./lib/analytics";

analytics.initialize();

createRoot(document.getElementById("root")!).render(<App />);
