import "./App.css";
import ResourcesApp from "./components/ResourcesApp";
import { RequestProvider } from "./components/providers/RequestProvider";
import { ResourcesActionsProvider } from "./components/providers/ResourcesActionsProvider";

function App() {
  return (
    <RequestProvider>
      <ResourcesActionsProvider>
        <ResourcesApp />
      </ResourcesActionsProvider>
    </RequestProvider>
  );
}

export default App;
