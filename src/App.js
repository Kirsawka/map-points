import YandexMap from './components/YandexMap/YandexMap';
import SideBar from './components/SideBar/SideBar';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setShowSideBar, setShowPlacemarks} from './store/reducers/settings';
import {addAddress} from './store/reducers/address';
import './App.css';

const API_URL = 'https://run.mocky.io/v3/6102c1b2-254f-4b7c-addb-67d4df752866';

function App() {

  const settings = useSelector((state) => state.settings.value);
  const allAddress = useSelector((state) => state.address.value);
  const dispatch = useDispatch();

  const ymaps = useRef(null);
  let placemarkRef = useRef(null);
  const mapRef = useRef(null);

  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [titles, setTitles] = useState([]);
  const [title, setTitle] = useState('');
  const [descriptions, setDescriptions] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(promise => promise.json())
      .then(data => {
        setTitles(data.reference.titles);
        setDescriptions(data.reference.descriptions);
      })
  }, []);

  const getTitleHandler = (text) => {
    setTitle(text);
  };

  const getDescriptionHandler = (text) => {
    setDescription(text);
  };

  const showSideBarHandler = () => {
    dispatch(setShowSideBar());
    dispatch(setShowPlacemarks());
    setAddress('адрес не выбран');
    mapRef.current.geoObjects.remove(placemarkRef.current);
    placemarkRef.current = null;
  };

  const hideSideBarHandler = () => {
    if (address !== 'адрес не выбран' && title && description) {
      dispatch(setShowSideBar());
      dispatch(setShowPlacemarks());
      addMarkers(coordinates.pop(), address, title, description);
    }
  };

  const addMarkers = (marker, address, title, description) => {
    const newPlacemark = {
      address,
      coords: marker,
      title,
      description
    }
    const copyAllAddress = Object.assign([], allAddress);
    copyAllAddress.push(newPlacemark);
    dispatch(addAddress(newPlacemark));
    localStorage.setItem('addresses', JSON.stringify(copyAllAddress));
  };

  const saveCoords = (coords) => {
    setCoordinates([...coordinates, coords]);
  }

  const getAddress = (coords) => {
    ymaps.current.geocode(coords).then((res) => {
      const firstGeoObject = res.geoObjects.get(0);
      const newAddress = firstGeoObject.getAddressLine();
      setAddress(newAddress);
      saveCoords(coords);
    });
  };

  const createPlacemark = (coords) => {
    return new ymaps.current.Placemark(
      coords,
      {},
      {
        preset: "islands#circleDotIcon",
        draggable: false,
        iconColor: 'red'
      }
    );
  };

  const onMapClick = (e) => {
    if (settings.showSideBar) {
      const coords = e.get("coords");
      if (placemarkRef.current) {
        placemarkRef.current.geometry.setCoordinates(coords);
      } else {
        placemarkRef.current = createPlacemark(coords);
        mapRef.current.geoObjects.add(placemarkRef.current);
      }
      getAddress(coords);
    }
  };

  return (
    <div className="App">
      {settings.showLoader && <div className="preloader">Загрузка карты ...</div>}
      <YandexMap ymaps={ymaps}
                 onMapClick={onMapClick}
                 mapRef={mapRef}/>
      {settings.showSideBar ? <SideBar hideSideBar={hideSideBarHandler}
                                       address={address}
                                       titles={titles}
                                       descriptions={descriptions}
                                       getTitle={getTitleHandler}
                                       getDescription={getDescriptionHandler}/> :
        !settings.showLoader && <button className='button' onClick={() => showSideBarHandler()}>Добавить адрес</button>}
    </div>
  );
}

export default App;
