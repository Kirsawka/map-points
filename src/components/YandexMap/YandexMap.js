import {Map, YMaps, Placemark} from '@pbe/react-yandex-maps';
import {useDispatch, useSelector} from 'react-redux';
import {setShowLoader} from '../../store/reducers/settings';
import styles from './YandexMap.module.css';

const mapState = {center: [55.76, 37.64], zoom: 10};

function YandexMap({ymaps, onMapClick, mapRef}) {

  const settings = useSelector((state) => state.settings.value);
  const allAddress = useSelector((state) => state.address.value);
  const dispatch = useDispatch();

  return (
    <YMaps query={{apikey: "dbc57ed5-9424-4c48-b93a-98fb54fc29c5"}}>
      <Map state={mapState} className={styles.map} onClick={onMapClick} instanceRef={mapRef}
           modules={["Placemark", "geocode", "geoObject.addon.balloon"]}
           onLoad={(ympasInstance) => {
             (ymaps.current = ympasInstance);
             dispatch(setShowLoader());
           }}>

        {settings.showPlacemarks && allAddress.map((marker, index) => <Placemark
          key={index}
          geometry={marker.coords}
          properties={{
            balloonContentHeader: marker.title,
            balloonContent: `<p class=${styles.balloon}>${marker.description}</p>`,
            balloonCloseButton: false,
            hideIconOnBalloonOpen: false,
          }}
          options={{
            preset: "islands#circleDotIcon",
            draggable: false
          }}/>)}

        {allAddress.length > 0 ? '' : <h1 className={styles.title}>Пусто</h1>}
      </Map>
    </YMaps>
  )
}

export default YandexMap;
