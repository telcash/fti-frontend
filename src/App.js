import { useDispatch } from 'react-redux';
import './App.css';
import MainDrawer from './components/main-drawer/MainDrawer';
import { fetchNotificaciones, fetchNotificationLastDate, setNotificaciones, updateNotificationLastDate } from './features/notificaciones/notificacionesSlice';
import { useEffect } from 'react';

function App() {

  const dispatch = useDispatch();

  const eventSource = new EventSource(process.env.REACT_APP_API_URL + 'notificacion/sse');

  eventSource.onmessage = ({data}) => {
    dispatch(updateNotificationLastDate({fecha: new Date()}));
    const dataParsed = JSON.parse(data);
    const notificaciones = dataParsed.notificaciones.data.notificaciones;
    dispatch(setNotificaciones(notificaciones));
  }

  useEffect(() => {
    dispatch(fetchNotificationLastDate()).then((response) => {
      const lastDate = new Date(response.payload);
      const currentTime = new Date();
      const timeDifference = currentTime - lastDate;
      const secondsPassed = Math.floor(timeDifference / 1000);
      if (secondsPassed >= 24 * 60 * 60) {
        dispatch(fetchNotificaciones());
        dispatch(updateNotificationLastDate({fecha: new Date()}));
      }
    })
  }
  ,[]);

  return (
    <main className="App">
      <MainDrawer />
    </main>
  );
}

export default App;