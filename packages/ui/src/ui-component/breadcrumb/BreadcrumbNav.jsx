// BreadcrumbNav.jsx
import { Breadcrumbs, Button, Stack, styled } from '@mui/material'
import { FolderOutlined, History, MoreVert } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import WalletConnection from '@/ui-component/wallet/WalletConnection'
const CustomBreadcrumb = styled(Breadcrumbs)({
    '& .MuiBreadcrumbs-separator': {
        color: '#9CA3AF',
        margin: '0 8px'
    }
})

const BreadcrumbLink = styled(Link)({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#6B7280',
    textDecoration: 'none',
    fontSize: '14px'
})

const BreadcrumbNav = () => {
    return (
        <Stack
            flexDirection='row'
            alignItems='center'
            spacing={2}
            sx={{
                height: '100%',
                py: 1,
                px: 2,
                borderRadius: '6px',
                padding: '0px'
            }}
        >
            <CustomBreadcrumb>
                <BreadcrumbLink to='#'>
                    <FolderOutlined sx={{ fontSize: 18 }} />
                    All
                </BreadcrumbLink>
                <BreadcrumbLink to='#'>New Project</BreadcrumbLink>
            </CustomBreadcrumb>
        </Stack>
    )
}

export default BreadcrumbNav
