import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const scannerId = "qr-reader";
    const html5QrCode = new Html5Qrcode(scannerId);
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // On successful scan
            html5QrCode.stop().then(() => {
              onScanSuccess(decodedText);
            });
          },
          () => {
            // Scanning in progress - ignore errors
          },
        );
        setScanning(true);
      } catch (err) {
        setError("Could not access camera. Please allow camera permission.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-5 flex justify-between items-center">
          <div>
            <h2
              className="text-white font-black text-xl"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              📷 Scan QR Code
            </h2>
            <p className="text-blue-200 text-xs mt-0.5">
              Point camera at student's QR code
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scanner */}
        <div className="p-6">
          {error ? (
            <div className="alert-error mb-4">{error}</div>
          ) : (
            <>
              {!scanning && (
                <div className="flex justify-center items-center h-40">
                  <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <div
                id="qr-reader"
                className="w-full rounded-2xl overflow-hidden"
                style={{ minHeight: scanning ? "auto" : "0" }}
              />
              {scanning && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  Align the QR code within the frame
                </p>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="w-full mt-4 btn-secondary text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
