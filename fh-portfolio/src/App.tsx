import "./App.css";
import ModelViewer from "./components/viewer";
import { SoundProvider } from "./sound";

function App() {
  console.log("Hello beautiful!");
  console.log("farhoodiamirhosein.pimary@gmail for easy access!");

  return (
    <SoundProvider>
      <div className="App" style={{ position: "relative" }}>
        <ModelViewer />
      </div>
    </SoundProvider>
  );
}

export default App;
