import React from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { Box } from '@mui/material'

const WalletConnection = () => {
    const { connected, publicKey } = useWallet()

    const formatAddress = (address) => {
        if (!address) return ''
        return `${address.toBase58().slice(0, 6)}...${address.toBase58().slice(-6)}`
    }

    return (
        <WalletMultiButton
            style={{
                color: '#111827',
                backgroundColor: '#FFFFFF',
                fontSize: '14px',
                height: '36.5px',
                border: 'solid 1px #111827',
               
                padding: '6px 16px',
                borderRadius: '4px',
                alignItems: 'center'
            }}
        >
            {!connected ? 'Connect Wallet' : formatAddress(publicKey)}
        </WalletMultiButton>
    )
}

export default WalletConnection
