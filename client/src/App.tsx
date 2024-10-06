import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import userStore from "./stores/UserStore";
import { observer } from "mobx-react-lite";

const App = observer(() => {
  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={
            userStore.isAuthenticated ? <Navigate to='/' /> : <LoginPage />
          }
        />
        <Route
          path='/'
          element={
            userStore.isAuthenticated ? (
              <ProductPage />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
      </Routes>
    </Router>
  );
});

export default App;
