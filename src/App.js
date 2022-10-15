import MyMap from './components/MyMap/MyMap';
import SideBar from './components/SideBar/SideBar';
import {useEffect, useRef, useState} from 'react';
import './App.css';

const API_URL = 'https://run.mocky.io/v3/6102c1b2-254f-4b7c-addb-67d4df752866';

function App() {

  const [showSideBar, setShowSideBar] = useState(false);
  const [showPlacemarks, setShowPlacemarks] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  const ymaps = useRef(null);
  let placemarkRef = useRef(null);
  const mapRef = useRef(null);

  const [address, setAddress] = useState('');
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  const [markers, setMarkers] = useState(addresses);
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
    setShowSideBar(true);
    setShowPlacemarks(false);
    setAddress('адрес не выбран');
    mapRef.current.geoObjects.remove(placemarkRef.current);
    placemarkRef.current = null;
  };

  const hideSideBarHandler = () => {
    setShowSideBar(false);
    setShowPlacemarks(true);
    addMarkers(coordinates.pop(), address, title, description);
  };

  const addMarkers = (marker, address, title, description) => {
    const newPlacemark = {
      address,
      coords: marker,
      title,
      description
    }
    const copyMarkers = Object.assign([], markers);
    copyMarkers.push(newPlacemark);
    setMarkers([...markers, newPlacemark]);
    localStorage.setItem('addresses', JSON.stringify(copyMarkers));
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
      }
    );
  };

  const onMapClick = (e) => {
    if (showSideBar) {
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

  const hideLoaderHandler = () => {
    setIsLoading(false);
  }

  return (
    <div className="App">
      {isLoading && <div className="preloader">Загрузка карты ...</div>}
      <MyMap ymaps={ymaps}
             onMapClick={onMapClick}
             mapRef={mapRef}
             coords={markers}
             showPlacemark={showPlacemarks}
             hideLoader={hideLoaderHandler}/>
      {showSideBar ? <SideBar hideSideBar={hideSideBarHandler}
                              address={address}
                              titles={titles}
                              descriptions={descriptions}
                              getTitle={getTitleHandler}
                              getDescription={getDescriptionHandler}/> :
        !isLoading && <button className='button' onClick={() => showSideBarHandler()}>Добавить адрес</button>}
    </div>
  );
}

export default App;
