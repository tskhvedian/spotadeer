import { useCallback, useRef, useState } from "react";
import AlertDialogDemo from "./_tests/AlertDialogDemo";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Libraries,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import { MarkerType, options } from "./_tests/OptionsAndTypes";
import { Button } from "./components/ui/button";

const center = {
  lat: 41.715137,
  lng: 44.827097,
};

const libraries: Libraries = ["places"];

function App() {
  const [openDialog, setOpenDialog] = useState(false);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selected, setSelected] = useState<MarkerType | null>();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDer0zwa6AKvY9ocR8EHG_glVhNb9BBORE",
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback((e: any) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng?.lat(),
        lng: e.latLng?.lng(),
        time: new Date(),
      },
    ]);
  }, []);
  const onCloseClick = useCallback(() => {
    setSelected(null);
  }, []);

  const onDeleteMarker = useCallback(() => {
    setOpenDialog(true);
  }, [openDialog]);

  const handleDeleteMarkerConfirmed = useCallback(() => {
    if (selected) {
      setMarkers((currentMarkers) =>
        currentMarkers.filter((marker) => marker !== selected)
      );
      setSelected(null);
      setOpenDialog(false); // Close the dialog after deletion
    }
  }, [selected]);

  if (!isLoaded)
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  if (loadError)
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  console.log(markers);
  console.log("Selected Marker: ", selected);

  return (
    <div className="h-screen w-full">
      <div className="absolute top-5 left-5 z-10 flex items-center space-x-2">
        <h1 className="font-bold text-2xl ">DEERS</h1>
        <span className="text-2xl mb-1">⛺</span>
      </div>
      <GoogleMap
        mapContainerClassName="map-container"
        zoom={12}
        center={center}
        options={options}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {markers &&
          markers.map((marker: MarkerType) => (
            <Marker
              key={marker.time.toISOString()}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{
                url: "/deer.png",
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
              }}
              onClick={() => {
                setSelected(marker);
              }}
            />
          ))}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={onCloseClick}
          >
            <div>
              <h1 className="text-lg">Deer Spotted!</h1>
              <p>{formatRelative(selected.time, new Date())}</p>
              <Button
                variant="link"
                className="py-1 px-0 text-sm"
                onClick={onDeleteMarker}
              >
                Delete marker
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <AlertDialogDemo
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleDeleteMarkerConfirmed={handleDeleteMarkerConfirmed}
      />
    </div>
  );
}

export default App;
