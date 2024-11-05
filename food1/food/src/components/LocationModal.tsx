import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetAddress: (address: string, coordinates: { lat: number; lng: number }) => void;
}

// Fix for default marker icon
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function LocationMarker({ position, setPosition }: { 
  position: LatLng | null; 
  setPosition: (pos: LatLng) => void;
}) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    }
  });

  return position ? (
    <Marker position={position} icon={defaultIcon} />
  ) : null;
}

export default function LocationModal({ isOpen, onClose, onSetAddress }: LocationModalProps) {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !position) {
      // Try to get user's location
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(new LatLng(pos.coords.latitude, pos.coords.longitude));
        },
        () => {
          // Default to a central location if geolocation fails
          setPosition(new LatLng(51.505, -0.09));
        }
      );
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position || !address) {
      return;
    }

    setLoading(true);
    try {
      onSetAddress(address, { lat: position.lat, lng: position.lng });
      onClose();
    } catch (error) {
      console.error('Error setting location:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center mb-4">
          <MapPin className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold">Set Delivery Location</h2>
        </div>

        <div className="mb-4 h-[400px] rounded-lg overflow-hidden">
          {position && (
            <MapContainer
              center={position}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              rows={2}
              placeholder="Enter your complete delivery address"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !position || !address}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                </div>
              ) : (
                'Confirm Location'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}