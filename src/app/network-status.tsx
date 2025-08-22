'use client'

import React, { useEffect, useState } from 'react';

function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {

    setIsOffline(!navigator.onLine);

    function handleNetworkChange() {
      setIsOffline(!navigator.onLine);
    }

    window.addEventListener('offline', handleNetworkChange);
    window.addEventListener('online', handleNetworkChange);

    return () => {
      window.removeEventListener('offline', handleNetworkChange);
      window.removeEventListener('online', handleNetworkChange);
    };
  }, []);

  return (
    <>

      {isOffline &&

        <div className="toast toast-end bottom-20 sm:bottom-0 sm:m-3">
          <div className="alert font-bold subpixel-antialiased select-none alert-warning flex justify-center mx-auto">
            <span>No Internet Connection</span>
          </div>
        </div>}



    </>

  );


}

export default NetworkStatus;