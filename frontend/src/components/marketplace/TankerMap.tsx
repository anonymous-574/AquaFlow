import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import tankerImg from "./s-1.png"; 
import { useSuppliers } from "@/hooks/useAPI";
import { Supplier } from "@/services/api";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix default icon issue with Vite/Webpack builds
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function TankerMap() {
  const { data: suppliers, isLoading, error } = useSuppliers();
  
  // Default map center (Pune)
  const mapCenter: LatLngTuple = [18.5204, 73.8567];
  
  // Fallback data if API fails or returns empty
  const fallbackLocations = [
    { id: 1, name: "HydroServe Tankers", coords: [18.5204, 73.8567] as LatLngTuple },
    { id: 2, name: "AquaLogistics Solutions", coords: [18.5972, 73.7898] as LatLngTuple },
    { id: 3, name: "City Water Carriers", coords: [18.5308, 73.8476] as LatLngTuple },
    { id: 4, name: "Reliable Aqua Supply", coords: [18.5603, 73.8077] as LatLngTuple },
    { id: 5, name: "Ganga Water Services", coords: [18.6298, 73.7997] as LatLngTuple },
    { id: 6, name: "Shanti Water Tankers", coords: [18.6394, 73.7864] as LatLngTuple },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tanker Locations Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 rounded-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={11}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {isLoading ? (
            // Show loading markers
            fallbackLocations.slice(0, 2).map((tanker) => (
              <Marker key={tanker.id} position={tanker.coords}>
                <Popup>Loading supplier data...</Popup>
              </Marker>
            ))
          ) : error || !suppliers || suppliers.length === 0 ? (
            // Show fallback data if error or no suppliers
            fallbackLocations.map((tanker) => (
              <Marker key={tanker.id} position={tanker.coords}>
                <Popup>
                  <strong>{tanker.name}</strong>
                  <br />
                  Available for booking
                </Popup>
              </Marker>
            ))
          ) : (
            // Show actual supplier data
            suppliers.map((supplier) => (
              supplier.lat && supplier.long ? (
                <Marker 
                  key={supplier.id} 
                  position={[supplier.lat, supplier.long] as LatLngTuple}
                >
                  <Popup>
                    <strong>{supplier.name}</strong>
                    <br />
                    {supplier.area}, {supplier.city}
                    <br />
                    Rating: {supplier.rating} ({supplier.num_reviews} reviews)
                    <br />
                    Available for booking
                  </Popup>
                </Marker>
              ) : null
            ))
          )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
