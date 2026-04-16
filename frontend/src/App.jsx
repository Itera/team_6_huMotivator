import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GlobalStyle from "../components/GlobalStyle.js";
import { ThemeProvider } from "../components/ThemeProvider.jsx";
import Home from "../pages/Home.jsx";
import Result from "../pages/Result.jsx";
import Settings from "../pages/Settings.jsx";

function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
