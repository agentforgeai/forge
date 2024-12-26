import { Box, Typography, Grid, Button } from '@mui/material'

const Features = () => {
    const features = [
        {
            title: 'No Coding Required',
            description:
                'Build AI applications effortlessly with our drag-and-drop interface. Deploy with customizable UIs or ready-to-use API endpoints.',
            icon: (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    aria-hidden='true'
                    className='h-6 w-6 text-white'
                    style={{
                        width: '24px',
                        height: '24px',
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5'
                    />
                </svg>
            )
        },
        {
            title: 'Pre-built Use Cases',
            description:
                'Leverage our extensive library of Templates inspired by real use cases. Achieve immediate results and customize to your needs.',
            icon: (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    aria-hidden='true'
                    className='h-6 w-6 text-white'
                    style={{
                        width: '24px',
                        height: '24px',
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z'
                    />
                </svg>
            )
        },
        {
            title: 'Enterprise-Grade Security',
            description:
                'Stack AI is SOC2, HIPAA, and GDPR compliant, and has DPAs signed with the main AI providers, such as Anthropic and OpenAI.',
            icon: (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    aria-hidden='true'
                    className='h-6 w-6 text-white'
                    style={{
                        width: '24px',
                        height: '24px',
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
                    />
                </svg>
            )
        },
        {
            title: 'On-Premise Deployment',
            description:
                'AgentForge can be self-hosted on your own servers or VPC (Virtual Private Cloud), giving you complete control over your data.',
            icon: (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    aria-hidden='true'
                    className='h-6 w-6 text-white'
                    style={{
                        width: '24px',
                        height: '24px',
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z'
                    />
                </svg>
            )
        }
    ]

    return (
        <Box
            sx={{
                marginTop: '24px !important',
                mx: 'auto',
                ml: { xs: 6, lg: '8.5rem' },
                mr: { xs: 6, lg: '8.5rem' }
            }}
        >
            <Grid container spacing={4}>
                {features.map((feature, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 40,
                                    width: 40,
                                    backgroundColor: 'primary.main',
                                    borderRadius: '8px',
                                    WebkitTransform: 'translateZ(0)',
                                    transform: 'translateZ(0)',
                                    WebkitBackfaceVisibility: 'hidden',
                                    backfaceVisibility: 'hidden',
                                    WebkitPerspective: '1000',
                                    perspective: '1000',
                                    overflow: 'hidden'
                                }}
                            >
                                <div
                                    style={{
                                        WebkitTransformStyle: 'preserve-3d',
                                        transformStyle: 'preserve-3d',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#fff'
                                    }}
                                >
                                    {feature.icon}
                                </div>
                            </Box>

                            <Typography
                                variant='h6'
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '1.25rem',
                                    color: 'text.primary',
                                    ml: '12px'
                                }}
                            >
                                {feature.title}
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: '1rem',
                                color: 'text.secondary',
                                lineHeight: '1.5'
                            }}
                        >
                            {feature.description}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 4
                }}
            >
                <Button
                    variant='contained'
                    size='large'
                    href='/canvas'
                    sx={{
                        fontWeight: '700',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        margin: '8px'
                    }}
                >
                    Launch Dapp
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    href='https://AgentForge.gitbook.io/AgentForge'
                    sx={{ margin: '8px', fontWeight: '700', padding: '12px 24px', borderRadius: '6px' }}
                >
                    Documents
                </Button>
            </Box>
        </Box>
    )
}

export default Features
