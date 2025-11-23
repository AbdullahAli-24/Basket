// icon fontawesome
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";
import Home from "./Pages/Home/Home";
import AboutUs from "./Components/AboutUs.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout.jsx";
import NotFound from "./Components/NotFound/NotFound";
import Cart from './Components/Cart/Cart';
import Checkout from './Components/Cart/Checkout';
import Paymoney from './Components/Cart/Paymoney';
import Signup from './Components/Signup.jsx';
import Login from './Components/Login.jsx';
import Blog from './Components/Blog.jsx'
import Contact from "./Components/Contact.jsx";
import CategoryPage from './Pages/CategoryPage/CategoryPage';
function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <AboutUs /> },
        { path: "signup", element: <Signup /> },
        { path: "login", element: <Login /> },
        { path: "cart", element:<Cart />},
        { path: "checkout", element:<Checkout />},
        { path: "blog", element:<Blog />},
        { path: "contact", element:<Contact />},
        { path: "paymoney", element:<Paymoney />},
        { path: "category/:categoryId", element: <CategoryPage /> },
        { path: "*", element: <NotFound /> },
      ],
      
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
