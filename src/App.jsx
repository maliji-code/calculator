import Calculator from "./assets/components/Calculator";
import Navbar from "./assets/components/Navbar";
import Footer from "./assets/components/Footer";
function App() {
  return (
    <>
    <Navbar/>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Calculator />
    </div>
    <Footer/>
    </>
  );
}

export default App;