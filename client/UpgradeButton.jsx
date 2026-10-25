import React, { useState } from 'react';

/**
 * UpgradeButton Component
 * 
 * Styled like an Ethio Telecom / Telebirr button using brand green (#8DC63F).
 * When clicked, changes state to "Waiting for Telebirr PIN..." for 3 seconds
 * to simulate the USSD phone prompt delay, then sends a POST request to /api/mock-upgrade.
 */
export default function UpgradeButton({
  shopId = 'SUQ-ETH-001',
  onSuccess,
  onError,
  className = '',
  children
}) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleUpgrade = () => {
    if (isWaiting) return;

    setIsWaiting(true);
    setErrorMessage(null);

    // 3-second delay to simulate the USSD phone prompt delay
    setTimeout(async () => {
      try {
        const payloadShopId = shopId || (() => {
          try {
            const user = JSON.parse(
              localStorage.getItem('suqsync_auth_user') || 
              localStorage.getItem('suqsync_local_merchant') || 
              '{}'
            );
            return user.pilotShopId || user._id || 'SUQ-ETH-001';
          } catch {
            return 'SUQ-ETH-001';
          }
        })();

        const response = await fetch('/api/mock-upgrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shopId: payloadShopId,
            id: payloadShopId,
            pilotShopId: payloadShopId,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success !== false) {
          setIsSuccess(true);
          if (onSuccess) {
            onSuccess(data);
          }
        } else {
          const err = new Error(data.message || 'Upgrade failed');
          setErrorMessage(data.message || 'Upgrade failed');
          if (onError) {
            onError(err);
          }
        }
      } catch (err) {
        console.error('Telebirr mock upgrade network error:', err);
        setErrorMessage(err.message || 'Network error');
        if (onError) {
          onError(err);
        }
      } finally {
        setIsWaiting(false);
      }
    }, 3000);
  };

  return (
    <button
      type="button"
      onClick={handleUpgrade}
      disabled={isWaiting}
      style={{
        backgroundColor: '#8DC63F',
        color: '#FFFFFF',
      }}
      className={`font-bold py-2.5 px-6 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-85 disabled:cursor-wait cursor-pointer flex items-center justify-center gap-2 ${className}`}
    >
      {isWaiting
        ? 'Waiting for Telebirr PIN...'
        : isSuccess
        ? 'Upgraded to Premium!'
        : children || 'Upgrade with Telebirr'}
    </button>
  );
}

export { UpgradeButton };
