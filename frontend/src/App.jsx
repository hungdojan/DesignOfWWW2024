import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import ShoppingListPage from "./pages/shoppingListPage";
import RecipePage from "./pages/recipePage";
import AddRecipePage from "./pages/addRecipePage";
import FavoriteRecipesPage from "./pages/favoriteRecipePage";
import ListRecipePage from "./pages/listRecipePage";

const App = () => {
  const publicRoutes = [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/recipe/view/:id",
      element: <RecipePage />,
    },
    {
      path: "/recipe/new",
      element: <AddRecipePage />,
    },
    {
      path: "/recipe/my_list",
      element: <ListRecipePage />,
    },
    {
      path: "/recipe/favorite",
      element: <FavoriteRecipesPage />,
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
