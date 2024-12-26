import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const CustomWalletButton = () => {
    const { connected } = useWallet();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (connected) {
            setLoading(true);

            try {
                // شبیه‌سازی یک عملیات async
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <style jsx global>{`
                .wallet-adapter-button-end-icon, 
                .wallet-adapter-button-start-icon, 
                .wallet-adapter-button-end-icon img, 
                .wallet-adapter-button-start-icon img {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    position: absolute !important;
                }
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #0A8272;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>

            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}

            <WalletMultiButton
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    backgroundColor: '#0A8272',
                    fontSize: '18px',
                    width: '100%',
                    height: '36.5px',
                    padding: '6px 16px',
                    borderRadius: '4px',
                }}
                onClick={handleClick}
            >
                {connected ? 'Create and Launch' : 'Connect Wallet'}
            </WalletMultiButton>
        </>
    );
};

export default CustomWalletButton;
