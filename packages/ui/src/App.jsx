import { useSelector } from 'react-redux'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { CssBaseline, Container, Box, Typography } from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { DialogProvider } from '@/contexts/DialogContext'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import '@solana/wallet-adapter-react-ui/styles.css' // این import مهم است
import { useLocation } from 'react-router-dom';

// routing
import Routes from '@/routes'

// defaultTheme
import themes from '@/themes'

// project imports
import NavigationScroll from '@/layout/NavigationScroll'

// ==============================|| MOBILE CHECK COMPONENT ||============================== //

const DESKTOP_ONLY_ROUTES = [
    '/canvas'
    // مسیرهای دیگری که می‌خواهید فقط در دسکتاپ نمایش داده شوند
]
const MobileCheck = () => {
    const [isMobile, setIsMobile] = useState(false)
    const location = useLocation();
    const currentPath = location.pathname;
    useEffect(() => {
        const checkIfMobile = () => {
            // Check if device is mobile using user agent
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

            // Check screen width
            const isNarrowScreen = window.innerWidth <= 768

            setIsMobile(isMobileDevice && isNarrowScreen)
        }

        checkIfMobile()
        window.addEventListener('resize', checkIfMobile)

        return () => {
            window.removeEventListener('resize', checkIfMobile)
        }
    }, [])

    const isRestrictedRoute = DESKTOP_ONLY_ROUTES.some(route => 
        currentPath.startsWith(route)
    )
    return (isMobile && isRestrictedRoute)  ? (
        <Container maxWidth='sm'>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    padding: '20px'
                }}
            >
                <Typography variant='h4' component='h1'>
                    Desktop Only
                </Typography>
                <Typography variant='body1'>Please use a desktop computer or tablet to access this content.</Typography>
            </Box>
        </Container>
    ) : null
}

// ==============================|| APP ||============================== //

const App = () => {
    const network = WalletAdapterNetwork.Devnet
    const endpoint = useMemo(() => clusterApiUrl(network), [network])
    const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [network])
    const customization = useSelector((state) => state.customization)

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <DialogProvider>
                    {/* <CssBaseline />
                    <MobileCheck />
                    <NavigationScroll>
                        <Routes />
                    </NavigationScroll> */}
                    <ConnectionProvider endpoint={endpoint}>
                        <WalletProvider wallets={wallets} autoConnect>
                            <WalletModalProvider>
                                <CssBaseline />
                                <MobileCheck />
                                <NavigationScroll>
                                    <Routes />
                                </NavigationScroll>
                            </WalletModalProvider>
                        </WalletProvider>
                    </ConnectionProvider>
                </DialogProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App
