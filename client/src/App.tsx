import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { observer } from "mobx-react-lite";
import { AuthPage } from "./pages/auth.page";
import { MainPage } from "./pages/main.page";

const App = observer(() => {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<MainPage />}
        />
        <Route
          path='/login'
          element={<AuthPage />}
        />
        {/* Перенаправление на логин для всех неизвестных маршрутов */}
        <Route
          path='*'
          element={<Navigate to='/login' />}
        />
      </Routes>
    </Router>
  );
});

export default App;
