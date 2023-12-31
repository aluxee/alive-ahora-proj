import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import Spots from './components/AllSpots/Spots'
import SpotPage from './components/AllSpots/SpotPage';
import CreateSpot from './components/AllSpots/CreateSpot/CreateSpot';
import CurrentSpots from './components/AllSpots/CurrentSpots/CurrentSpots';
import UpdateSpot from './components/AllSpots/UpdateSpot';
import RemoveSpot from './components/AllSpots/RemoveSpot/RemoveSpot';
// import * as spotActions from './store/spot';



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
      <div className='nav-wrapper'>
        <Navigation isLoaded={isLoaded} />
      </div>
      <div className='outlet-wrapper'>
        {isLoaded && <Outlet />}
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element:
          <Spots />
      },
      {
        path: '/spots',
        element:
          <>
            <Spots />
            <Outlet />
          </>
      },
      {
        index: true,
        path: '/spots/:spotId',
        element: <SpotPage />
      },
      {
        path: '/spots/new',
        element: <CreateSpot />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpot />
      },
      {
        path: '/spots/current',
        element: <CurrentSpots />,
    
      }
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
