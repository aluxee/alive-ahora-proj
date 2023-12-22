import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import Spots from './components/AllSpots/Spots'
import SpotPage from './components/AllSpots/SpotPage';
import CreateSpotForm from './components/Forms/CreateSpotForm/CreateSpotForm';
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
          <>
            <Spots />,

          </>
      },

      {
        path: 'spots',
        element: <Outlet />,
        children: [
          {
            index: true,
            path: ':spotId',
            element:
              <>
                <SpotPage />

              </>
          },
          {
            path: 'new',
            element: <CreateSpotForm />
          },
        ]
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
