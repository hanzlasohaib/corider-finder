import Routes from "./routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="bottom-center"
        containerClassName="!bottom-6 sm:!bottom-8"
        toastOptions={{
          duration: 4000,
          className:
            "!bg-white !text-slate-800 !text-sm !font-medium !shadow-lg !rounded-xl !border !border-slate-200/80 !px-4 !py-3",
          success: {
            iconTheme: { primary: "#059669", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
          },
        }}
      />
      <Routes />
    </>
  );
}

export default App;
