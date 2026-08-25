import { useState } from "react";
import Calculator from "./assets/components/Calculator";
import Navbar from "./assets/components/Navbar";
import Footer from "./assets/components/Footer";

function App() {
  const [activeTab, setActiveTab] = useState("Basic");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <div className={darkMode ? "app dark-mode" : "app"}>
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} onThemeChange={setDarkMode} />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <Calculator activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
        <Footer onTabChange={setActiveTab} />
      </div>
    </>
  );
}

export default App;