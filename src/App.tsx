import "./App.css";
import ResourcesApp from "./components/ResourcesApp";
import { ResourcesProvider } from "./components/providers/ResourcesProvider";

function App() {
  return (
    <ResourcesProvider>
      <ResourcesApp />
    </ResourcesProvider>
  );
}

export default App;
