import "./App.css";
import ResourcesDropdown from "./components/ResourcesDropdown";
import { RequestProvider } from "./components/RequestProvider";

function App() {
  return (
    <RequestProvider>
      <ResourcesDropdown />
    </RequestProvider>
  );
}

export default App;
