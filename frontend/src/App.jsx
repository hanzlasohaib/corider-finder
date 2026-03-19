import Routes from './routes'
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* routes */}
      <Routes />
    </>
  );
}

export default App
