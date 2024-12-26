import React from 'react'
import { Container, Grid, Typography, Divider, Box, IconButton, List, ListItem, Link } from '@mui/material'
import TelegramIcon from '@mui/icons-material/Telegram'
import GithubIcon from '@mui/icons-material/GitHub'
import Logo from '../../assets/images/logo-white.png'
const Footer = () => {
    return (
        <Box sx={{ padding: '40px 0' }}>
            <Container maxWidth='lg'>
                <Grid container spacing={4} display='flex' flexDirection='column' alignItems='center'>
                    <Box display='flex' flexDirection='column' alignItems='center'>
                        <img src={Logo} alt='Logo' style={{ width: '150px', marginbottom: '12px !important', padding: '16px' }} />
                        <Typography variant='body2' color='textSecondary' align='center' padding={2}>
                            Build and Deploy AI Applications in minutes
                        </Typography>
                        <Box display='flex' justifyContent='left'>                            
                            <IconButton color='#fff' href='https://github.com/AgentForge/AgentForge'>
                                <GithubIcon />
                            </IconButton>
                            <IconButton color='#fff' href='https://x.com/DFacilitatorAI'>
                                <svg
                                    className='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1wmkh38'
                                    focusable='false'
                                    aria-hidden='true'
                                    viewBox='0 0 24 24'
                                    data-testid='XIcon'
                                    width='24px'
                                    style={{ fill: '#ffffff' }}
                                >
                                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'></path>
                                </svg>
                            </IconButton>
                        </Box>
                    </Box>
                </Grid>
                <Divider sx={{ margin: '20px 0' }} />

                {/* Footer Bottom */}
                <Grid container justifyContent='center'>
                    <Grid item>
                        <Typography variant='body2' color='textSecondary' align='center'>
                            © 2024 AgentForge™ (Eigen Inc.). All Rights Reserved.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Footer
