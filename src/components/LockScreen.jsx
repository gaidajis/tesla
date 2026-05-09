import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Key, RefreshCcw, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function LockScreen() {
  const { login, initAuth, hasStoredTokens } = useAuthStore();

  const [hasStored, setHasStored] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState(null);

  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  useEffect(() => {
    setHasStored(hasStoredTokens());
  }, [hasStoredTokens]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (hasStored) {
      if (!masterPassword) {
        setError('Master Password is required to unlock.');
        return;
      }
      const success = initAuth(masterPassword);
      if (!success) {
        setError('Invalid Master Password or corrupted data.');
      }
    } else {
      if (!accessToken || !refreshToken || !masterPassword) {
        setError('All fields are required.');
        return;
      }
      const success = login(accessToken, refreshToken, masterPassword);
      if (!success) {
        setError('Failed to securely store tokens.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[#171a20] rounded-2xl p-8 shadow-2xl border border-gray-800"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <ShieldCheck size={64} className="text-[#e82127]" />
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">Tesla Fleet App</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          {hasStored ? "Enter Master Password to unlock encrypted tokens." : "Bring Your Own Token (BYOT) Setup. Your tokens are encrypted locally."}
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center"
          >
            <ShieldAlert size={20} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!hasStored && (
            <>
              <div>
                <label className="block text-gray-400 text-sm mb-1 font-medium flex items-center">
                  <Key size={14} className="mr-1" /> Access Token
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full bg-[#111111] text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e82127] focus:ring-1 focus:ring-[#e82127] transition-colors"
                  placeholder="ey..."
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1 font-medium flex items-center">
                  <RefreshCcw size={14} className="mr-1" /> Refresh Token
                </label>
                <input
                  type="password"
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  className="w-full bg-[#111111] text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e82127] focus:ring-1 focus:ring-[#e82127] transition-colors"
                  placeholder="ey..."
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-400 text-sm mb-1 font-medium flex items-center">
              <Lock size={14} className="mr-1" /> Master Password
            </label>
            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="w-full bg-[#111111] text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#e82127] focus:ring-1 focus:ring-[#e82127] transition-colors"
              placeholder="Strong password..."
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#e82127] hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-red-900/20"
          >
            {hasStored ? "Unlock Dashboard" : "Encrypt & Store Tokens"}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          Tokens are encrypted with AES using your Master Password. Data never leaves your browser except to communicate with the official Tesla Fleet API.
        </div>
      </motion.div>
    </div>
  );
}
