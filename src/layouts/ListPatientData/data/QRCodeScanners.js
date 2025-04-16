import { useEffect } from "react";
import PropTypes from "prop-types";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRCodeScanner({ onScanSuccess, onError }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText, decodedResult) => {
        onScanSuccess(decodedText);
        scanner.clear(); // stop scanning after success
      },
      (error) => {
        if (onError) onError(error);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScanSuccess, onError]);

  return <div id="reader" />;
}

// ✅ Add PropTypes validation
QRCodeScanner.propTypes = {
  onScanSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

export default QRCodeScanner;
