import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import ShoppingListPage from "./pages/shoppingListPage";
import RecipePage from "./pages/recipePage";
import AddRecipePage from "./pages/addRecipePage";

const App = () => {
  const publicRoutes = [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/recipe",
      element: <RecipePage />,
    },
    {
      path: "/recipe/new",
      element: <AddRecipePage />,
    },
    {
      path: "/shop_list",
      element: <ShoppingListPage />,
    },
  ];
  const router = createBrowserRouter([...publicRoutes]);
  return <RouterProvider router={router} />;
};

export default App;
