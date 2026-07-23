import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { FiCamera, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { attendanceService } from '../../services/attendanceService';

export default function Scanner() {
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [sessionCount, setSessionCount] = useState(0);

  const processQr = async (decodedText) => {
    try {
      const { data } = await attendanceService.scan(decodedText);
      setLastResult({ ok: true, message: `Checked in: ${data.data.ticket.ticketId}` });
      setSessionCount((c) => c + 1);
      toast.success('Attendance marked');
    } catch (err) {
      setLastResult({ ok: false, message: err.response?.data?.message || 'Scan failed' });
      toast.error(err.response?.data?.message || 'Scan failed');
    }
  };

  const startScanning = async () => {
    setScanning(true);
    html5QrRef.current = new Html5Qrcode('qr-reader');
    try {
      await html5QrRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          processQr(decodedText);
        },
        () => {} // ignore per-frame scan failures
      );
    } catch (err) {
      toast.error('Camera access denied or unavailable. Use manual entry below.');
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (html5QrRef.current) {
      await html5QrRef.current.stop().catch(() => {});
      html5QrRef.current.clear();
    }
    setScanning(false);
  };

  useEffect(() => () => { if (html5QrRef.current) html5QrRef.current.stop().catch(() => {}); }, []);

  return (
    <div className="max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl">Scan Attendance</h1>
        <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
          {sessionCount} checked in this session
        </span>
      </div>

      <div className="card p-6">
        <div id="qr-reader" ref={scannerRef} className="mb-4 overflow-hidden rounded-lg" />

        {!scanning ? (
          <button onClick={startScanning} className="btn-primary w-full"><FiCamera /> Start Camera Scan</button>
        ) : (
          <button onClick={stopScanning} className="btn-outline w-full">Stop Scanning</button>
        )}

        <div className="ticket-perforation my-6" />

        <label className="mb-1 block text-sm font-medium">Or paste QR payload manually</label>
        <div className="flex gap-2">
          <input value={manualInput} onChange={(e) => setManualInput(e.target.value)} className="input-field" placeholder='{"ticketId":"..."}' />
          <button onClick={() => processQr(manualInput)} className="btn-outline whitespace-nowrap">Verify</button>
        </div>

        {lastResult && (
          <div className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-sm ${lastResult.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {lastResult.ok ? <FiCheckCircle /> : <FiXCircle />} {lastResult.message}
          </div>
        )}
      </div>
    </div>
  );
}
