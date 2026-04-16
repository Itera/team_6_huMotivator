import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GlobalStyle from "../components/GlobalStyle";
import { ThemeProvider } from "../components/ThemeProvider";
import Home from "../pages/Home";
import Prompt from "../pages/Prompt";
import Result from "../pages/Result";
import Settings from "../pages/Settings";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prompt/:coach" element={<Prompt />} />
          <Route path="/result" element={<Result />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
