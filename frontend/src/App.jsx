import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import SpotsIndex from "./components/Spots/AllSpots/SpotsIndex";


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}

    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsIndex />
      },
      // {
      //   path: '/spots',
      //   element:
      //     <>
      //       <SpotsIndex />
      //       {/* <Outlet /> */}
      //     </>,
      //   children: [
      //     {
      //       path: '/:spotId'
      //     }
      //   ]
      // }

    ]
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
