import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from "./components/Calendar";
import DayPage from "./pages/DayPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/day/:date" element={<DayPage />} />
      </Routes>
    </Router>
  );
};

export default App;
