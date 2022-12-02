import { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { useAppDispatch } from "./hooks/reduxHooks";
import { GamePage } from "./pages";
import ErrorPage from "./pages/errorPage/ErrorPage";
import LandingPage from "./pages/landingPage/LandingPage";
import { fetchAlchemyInfo } from "./store/alchemy/thunks";

function App() {
  ///hooks
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAlchemyInfo());
  }, [dispatch]);

  /// return
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
