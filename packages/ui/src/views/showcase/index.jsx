import { Canvas } from '@react-three/fiber'
import { Blob } from './Blob'
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, Typography, Stack, TextField, Button, Tabs, Tab, IconButton, Container, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import Logo from '../../assets/images/logo-white.png'
// icons
import { IconSettings, IconChevronLeft, IconDeviceFloppy, IconPencil, IconCheck, IconX, IconCode } from '@tabler/icons-react'
import { ShareOutlined, PlayArrow, InfoOutlined, SaveOutlined } from '@mui/icons-material'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Margin } from '@mui/icons-material'
import Features from './Features'
import Footer from './footer'
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2563eb',
            light: '#3b82f6',
            dark: '#1d4ed8'
        },
        background: {
            default: '#0A0A0A',
            paper: '#111827'
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#9CA3AF'
        }
    },
    typography: {
        fontFamily: '__Inter_d65c78, sans-serif',
        h1: {
            fontFamily: '__Inter_d65c78, sans-serif',
            color: '#FFFFFF'
        },
        h2: {
            fontFamily: '__Inter_d65c78, sans-serif',
            color: '#FFFFFF'
        },
        h5: {
            color: '#E5E7EB'
        },
        body1: {
            fontFamily: '__Inter_d65c78, sans-serif',
            color: '#D1D5DB'
        },
        button: {
            fontFamily: '__Inter_d65c78, sans-serif'
        }
    }
})

function Index() {
    const ActionButton = styled(Button)(({ theme }) => ({
        textTransform: 'none',
        padding: '6px 16px',
        color: '#E5E7EB',
        backgroundColor: '#1F2937',
        '&:hover': {
            backgroundColor: '#374151'
        },
        '& .MuiSvgIcon-root': {
            fontSize: 20,
            marginRight: 4
        }
    }))

    const PublishButton = styled(Button)(({ theme }) => ({
        textTransform: 'none',
        padding: '6px 16px',
        color: '#FFFFFF',
        backgroundColor: '#2563eb',
        '&:hover': {
            backgroundColor: '#1d4ed8'
        }
    }))

    const GradientText = styled(Typography)`
        background: linear-gradient(to right, #60a5fa, #3b82f6, #93c5fd);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        animation: textShine 3s ease-in-out infinite;

        @keyframes textShine {
            0%,
            100% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
        }
    `

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
                <Container maxWidth='lg'>
                    <Box
                        sx={{
                            padding: '16px 24px',
                            width: '100%'
                        }}
                    >
                        <Stack
                            direction='row'
                            sx={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                '@media (max-width: 370px)': {
                                    justifyContent: 'center'
                                }
                            }}
                        >
                            <Box
                                component='img'
                                sx={{
                                    height: 28,
                                    marginInlineEnd: '8px'
                                }}
                                alt='Logo'
                                src={Logo}
                            />
                            <Box />
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    '@media (min-width: 370px)': {
                                        display: 'inline-flex'
                                    }
                                }}
                            >
                                <PublishButton
                                    href='/canvas'
                                    sx={{
                                        fontWeight: '600'
                                    }}
                                >
                                    Launch Dapp
                                </PublishButton>
                            </Box>
                        </Stack>
                    </Box>
                    <Box sx={{ width: '100%', mt: 4 }}>
                        <Grid container spacing={3} justifyContent='center'>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={2.5}>
                                    <Box
                                        sx={{
                                            maxWidth: 'lg',
                                            mx: 'auto',
                                            px: { xs: 2, sm: 4 },
                                            py: { xs: 6, sm: 8, lg: 10 }
                                        }}
                                    >
                                        <Stack spacing={4} alignItems={{ xs: 'center', lg: 'flex-start' }}>
                                            <Stack spacing={1} textAlign={{ xs: 'center', lg: 'left' }}>
                                                <Typography
                                                    variant='h1'
                                                    sx={{
                                                        fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
                                                        fontWeight: '700',
                                                        letterSpacing: '-0.02em',
                                                        '& span': {
                                                            background: 'linear-gradient(to right, #2563eb, #3b82f6, #000000)',
                                                            WebkitBackgroundClip: 'text',
                                                            backgroundClip: 'text',
                                                            color: 'transparent',
                                                            backgroundSize: '200% 200%',
                                                            animation: 'gradient 3s ease infinite'
                                                        },
                                                        '@keyframes gradient': {
                                                            '0%': {
                                                                backgroundPosition: '0% 50%'
                                                            },
                                                            '50%': {
                                                                backgroundPosition: '100% 50%'
                                                            },
                                                            '100%': {
                                                                backgroundPosition: '0% 50%'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    The Enterprise <span>Generative AI</span> Platform
                                                </Typography>
                                            </Stack>

                                            <Stack spacing={1} sx={{ maxWidth: 'md' }}>
                                                <Typography
                                                    variant='h5'
                                                    sx={{
                                                        fontSize: '20px',
                                                        textAlign: {
                                                            xs: 'center', // وسط‌چین در موبایل
                                                            md: 'left' // چپ‌چین در دسکتاپ
                                                        },
                                                        '& span': {
                                                            background: 'linear-gradient(to right, #2563eb, #3b82f6, #000000)',
                                                            WebkitBackgroundClip: 'text',
                                                            fontWeight: '700',
                                                            backgroundClip: 'text',
                                                            color: 'transparent',
                                                            backgroundSize: '200% 200%',
                                                            animation: 'gradient 3s ease infinite'
                                                        },
                                                        '@keyframes gradient': {
                                                            '0%': {
                                                                backgroundPosition: '0% 50%'
                                                            },
                                                            '50%': {
                                                                backgroundPosition: '100% 50%'
                                                            },
                                                            '100%': {
                                                                backgroundPosition: '0% 50%'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    A <span>Friendly</span> and <span>Powerful</span>
                                                </Typography>
                                                <Typography
                                                    variant='h5'
                                                    sx={{
                                                        fontSize: '20px',
                                                        textAlign: {
                                                            xs: 'center', // وسط‌چین در موبایل
                                                            md: 'left' // چپ‌چین در دسکتاپ
                                                        },
                                                        '& span': {
                                                            background: 'linear-gradient(to right, #2563eb, #3b82f6, #000000)',
                                                            WebkitBackgroundClip: 'text',
                                                            fontWeight: '700',
                                                            backgroundClip: 'text',
                                                            color: 'transparent',
                                                            backgroundSize: '200% 200%',
                                                            animation: 'gradient 3s ease infinite'
                                                        },
                                                        '@keyframes gradient': {
                                                            '0%': {
                                                                backgroundPosition: '0% 50%'
                                                            },
                                                            '50%': {
                                                                backgroundPosition: '100% 50%'
                                                            },
                                                            '100%': {
                                                                backgroundPosition: '0% 50%'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Interface to <span>Build AI Solutions</span>.
                                                </Typography>
                                                <Typography
                                                    variant='h5'
                                                    sx={{
                                                        fontSize: '20px',
                                                        textAlign: {
                                                            xs: 'center',
                                                            md: 'left'
                                                        },
                                                        '& span': {
                                                            background: 'linear-gradient(to right, #2563eb, #3b82f6, #000000)',
                                                            WebkitBackgroundClip: 'text',
                                                            fontWeight: '700',
                                                            backgroundClip: 'text',
                                                            color: 'transparent',
                                                            backgroundSize: '200% 200%',
                                                            animation: 'gradient 3s ease infinite'
                                                        },
                                                        '@keyframes gradient': {
                                                            '0%': {
                                                                backgroundPosition: '0% 50%'
                                                            },
                                                            '50%': {
                                                                backgroundPosition: '100% 50%'
                                                            },
                                                            '100%': {
                                                                backgroundPosition: '0% 50%'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Build your own <span>Agent</span>.
                                                </Typography>
                                            </Stack>

                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                <Button
                                                    href='/canvas'
                                                    variant='text'
                                                    size='large'
                                                    sx={{
                                                        color: '#fff',
                                                        backgroundColor: 'primary.main',
                                                        fontWeight: '700',
                                                        padding: '12px 24px',
                                                        borderRadius: '6px'
                                                    }}
                                                >
                                                    Launch Dapp
                                                </Button>
                                                <Button
                                                    variant='text'
                                                    size='large'
                                                    href='https://github.com/AgentForge/AgentForge'
                                                    sx={{
                                                        color: 'primary.main',
                                                        fontWeight: '700',
                                                        padding: '12px 24px',
                                                        border: '1px solid #2563eb',
                                                        borderRadius: '6px',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                                            '& .MuiSvgIcon-root': {
                                                                transform: 'translateX(4px)'
                                                            }
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            transition: 'transform 0.2s'
                                                        }
                                                    }}
                                                >
                                                    GitHub
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                    display: {
                                        xs: 'none', // پنهان در موبایل
                                        md: 'block' // نمایش در دسکتاپ
                                    }
                                }}
                            >
                                <Stack spacing={2.5} sx={{ height: '608px', width: '100%' }}>
                                    <Canvas camera={{ position: [0.0, 0.0, 8.0] }} style={{ height: '100%' }}>
                                        <Blob />
                                    </Canvas>
                                </Stack>
                            </Grid>
                            <Box display='flex' justifyContent='center' alignItems='center' width='100%' height='100px' position='relative'>
                                <Typography
                                    variant='h5'
                                    sx={{
                                        fontSize: '20px',
                                        textAlign: 'center',
                                        position: 'relative',
                                        zIndex: 2,
                                        padding: '10px',
                                        borderRadius: '10px', // گرد کردن گوشه‌ها
                                        '& span': {
                                            background: 'linear-gradient(to right, #2563eb, #3b82f6, #000000)', // رنگ‌های گرادیانت برای متن
                                            WebkitBackgroundClip: 'text',
                                            fontWeight: '700',
                                            backgroundClip: 'text',
                                            color: 'transparent',
                                            backgroundSize: '200% 200%',
                                            animation: 'gradient 3s ease infinite'
                                        },
                                        '@keyframes gradient': {
                                            '0%': {
                                                backgroundPosition: '0% 50%'
                                            },
                                            '50%': {
                                                backgroundPosition: '100% 50%'
                                            },
                                            '100%': {
                                                backgroundPosition: '0% 50%'
                                            }
                                        }
                                    }}
                                >
                                    <span>CA:</span> HTV2U14yZwFRhNbKX1rfiiVXhJUKUCM7UtHFF4jnpump
                                </Typography>

                                {/* حاشیه انیمیشنی درخشان */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        right: '0',
                                        bottom: '0',
                                        borderRadius: '10px', // گرد کردن حاشیه
                                        border: '5px solid transparent', // شفاف بودن اولیه
                                        backgroundSize: '200% 200%',
                                        animation: 'glowingBorder 3s ease infinite', // انیمیشن حرکت رنگ‌ها
                                        zIndex: 1,

                                        // انیمیشن حاشیه درخشان
                                        '@keyframes glowingBorder': {
                                            '0%': {
                                                boxShadow: '0 0 5px #2563eb, 0 0 10px #2563eb, 0 0 15px #2563eb'
                                            },
                                            '50%': {
                                                boxShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6'
                                            },
                                            '100%': {
                                                boxShadow: '0 0 15px #000000, 0 0 25px #000000, 0 0 35px #000000'
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Box>
                    <Box>
                        <Stack spacing={1} textAlign={{ xs: 'center', lg: 'left' }}>
                            <Typography
                                variant='h1'
                                sx={{
                                    marginTop: {
                                        xs: '24px !important',
                                        md: '100px !important'
                                    },
                                    fontSize: {
                                        xs: '24px',
                                        md: '48px'
                                    },
                                    fontWeight: '700',
                                    letterSpacing: '-0.02em',
                                    textAlign: 'center',
                                    '& span': {
                                        display: 'block',
                                        fontSize: '16px',
                                        background: 'linear-gradient(to right, #2563eb, #3b82f6, #000000)',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        backgroundSize: '200% 200%',
                                        animation: 'gradient 3s ease infinite'
                                    },
                                    '@keyframes gradient': {
                                        '0%': {
                                            backgroundPosition: '0% 50%'
                                        },
                                        '50%': {
                                            backgroundPosition: '100% 50%'
                                        },
                                        '100%': {
                                            backgroundPosition: '0% 50%'
                                        }
                                    }
                                }}
                            >
                                <span>Platform</span>
                                A Friendly and Powerful
                                <br />
                                Interface to Build AI Agents
                            </Typography>

                            <video
                                id='customVideo'
                                poster='/video.png'
                                class='w-full rounded-xl border border-gray-300 shadow-lg shadow-blue-600/10'
                                loop
                            >
                                <source src='https://AgentForge.site/video.webm' type='video/webm' />
                                <source src='https://AgentForge.site/video.mp4' type='video/mp4' />
                                Your browser does not support the video tag.
                            </video>
                            <Features />
                        </Stack>
                        <Footer />
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    )
}

export default Index
