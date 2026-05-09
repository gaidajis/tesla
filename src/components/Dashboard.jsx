import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { teslaApi } from '../services/teslaApi';
import {
  LogOut, Car, Battery, MapPin, Thermometer,
  Unlock, Lock, Zap, Power, Download, RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const { logout, accessToken } = useAuthStore();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    teslaApi.setToken(accessToken);
    fetchVehicles();
  }, [accessToken]);

  useEffect(() => {
    if (selectedVehicleId) {
      fetchVehicleData(selectedVehicleId);
    }
  }, [selectedVehicleId]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await teslaApi.getVehicles();
      if (res.response && res.response.length > 0) {
        setVehicles(res.response);
        setSelectedVehicleId(res.response[0].id_s);
      } else {
        setError('No vehicles found on this account.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleData = async (id) => {
    try {
      setLoading(true);
      const res = await teslaApi.getVehicleData(id);
      setVehicleData(res.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommand = async (commandName, action) => {
    if (!selectedVehicleId) return;
    try {
      setActionLoading(commandName);
      await action(selectedVehicleId);
      // Wait a moment then refresh data
      setTimeout(() => fetchVehicleData(selectedVehicleId), 2000);
    } catch (err) {
      alert(`Command failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = () => {
    if (vehicleData) {
      teslaApi.exportTelemetry(vehicleData);
    }
  };

  if (loading && !vehicleData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <RefreshCw size={48} className="text-[#e82127]" />
        </motion.div>
      </div>
    );
  }

  const batteryLevel = vehicleData?.charge_state?.battery_level || 0;
  const batteryRange = vehicleData?.charge_state?.battery_range || 0;
  const odometer = vehicleData?.vehicle_state?.odometer || 0;
  const isLocked = vehicleData?.vehicle_state?.locked;
  const isClimateOn = vehicleData?.climate_state?.is_climate_on;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Car size={32} className="text-[#e82127]" />
          <h1 className="text-2xl font-bold">Fleet Dashboard</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Lock</span>
        </button>
      </header>

      {error && (
        <div className="max-w-6xl mx-auto bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col: Vehicle Selector & Overview */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#171a20] rounded-2xl p-6 border border-gray-800"
          >
            <h2 className="text-lg text-gray-400 mb-4 uppercase tracking-wider text-sm font-semibold">Select Vehicle</h2>
            <select
              value={selectedVehicleId || ''}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-[#111111] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#e82127]"
            >
              {vehicles.map(v => (
                <option key={v.id_s} value={v.id_s}>{v.display_name || v.vin}</option>
              ))}
            </select>
          </motion.div>

          {vehicleData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#171a20] rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{vehicleData.display_name || 'My Tesla'}</h2>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${vehicleData.state === 'online' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                  {vehicleData.state}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex items-center text-gray-400">
                    <Battery size={20} className="mr-3" /> Battery
                  </div>
                  <div className="font-semibold">{batteryLevel}%</div>
                </div>

                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex items-center text-gray-400">
                    <Zap size={20} className="mr-3" /> Range
                  </div>
                  <div className="font-semibold">{Math.round(batteryRange)} mi</div>
                </div>

                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex items-center text-gray-400">
                    <Car size={20} className="mr-3" /> Odometer
                  </div>
                  <div className="font-semibold">{Math.round(odometer).toLocaleString()} mi</div>
                </div>

                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center text-gray-400">
                    <Thermometer size={20} className="mr-3" /> Interior Temp
                  </div>
                  <div className="font-semibold">{vehicleData?.climate_state?.inside_temp || '--'}°C</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Col: Controls & Actions */}
        {vehicleData && (
          <div className="lg:col-span-2 space-y-6">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#171a20] rounded-2xl p-6 border border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <ControlButton
                icon={isLocked ? <Lock size={24}/> : <Unlock size={24}/>}
                label={isLocked ? 'Unlock' : 'Lock'}
                loading={actionLoading === 'lock'}
                onClick={() => handleCommand('lock', (id) => teslaApi.setDoorLock(id, !isLocked))}
              />
              <ControlButton
                icon={<Power size={24}/>}
                label={isClimateOn ? 'Stop HVAC' : 'Start HVAC'}
                loading={actionLoading === 'hvac'}
                active={isClimateOn}
                onClick={() => handleCommand('hvac', (id) => teslaApi.setHvac(id, !isClimateOn))}
              />
              <ControlButton
                icon={<Zap size={24}/>}
                label="Flash"
                loading={actionLoading === 'flash'}
                onClick={() => handleCommand('flash', (id) => teslaApi.flashLights(id))}
              />
              <ControlButton
                icon={<Car size={24}/>}
                label="Honk"
                loading={actionLoading === 'honk'}
                onClick={() => handleCommand('honk', (id) => teslaApi.honkHorn(id))}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#171a20] rounded-2xl p-6 border border-gray-800 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold mb-1">Telemetry Data</h3>
                <p className="text-gray-400 text-sm">Download current vehicle state JSON</p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 bg-[#111111] hover:bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={18} />
                <span>Export</span>
              </button>
            </motion.div>

          </div>
        )}

      </main>
    </div>
  );
}

function ControlButton({ icon, label, loading, active, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 ${
        active
          ? 'bg-[#e82127]/20 border-[#e82127] text-[#e82127]'
          : 'bg-[#111111] border-gray-800 hover:border-gray-600 text-gray-300'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <RefreshCw size={24} />
        </motion.div>
      ) : (
        icon
      )}
      <span className="mt-3 text-sm font-medium">{label}</span>
    </button>
  );
}
