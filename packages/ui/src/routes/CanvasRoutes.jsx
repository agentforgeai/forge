import { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import Loadable from '@/ui-component/loading/Loadable'

// Lazy loaded components
const Canvas = Loadable(lazy(() => import('@/views/canvas')))
const Showcase = Loadable(lazy(() => import('@/views/showcase/index')))
const MarketplaceCanvas = Loadable(lazy(() => import('@/views/marketplaces/MarketplaceCanvas')))

const CanvasRoutes = {
    path: '/',
    children: [
        {
            path: '/',
            element: <Showcase />
        },
        {
            path: 'canvas',
            element: <Canvas />
        },
        {
            path: 'canvas/:id',
            element: <Canvas />
        },
        {
            path: 'agentcanvas',
            element: <Canvas />
        },
        {
            path: 'agentcanvas/:id',
            element: <Canvas />
        },
        {
            path: 'marketplace/:id',
            element: <MarketplaceCanvas />
        }
    ]
}

export default CanvasRoutes
