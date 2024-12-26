import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { IconButton } from '@mui/material'
import GithubIcon from '@mui/icons-material/GitHub'
// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    ClickAwayListener,
    Divider,
    InputAdornment,
    List,
    ListItemButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    OutlinedInput,
    Paper,
    Popper,
    Stack,
    Typography,
    Chip,
    Tab,
    Tabs
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import Transitions from '@/ui-component/extended/Transitions'
import { StyledFab } from '@/ui-component/button/StyledFab'

// icons
import { IconPlus, IconSearch, IconMinus, IconX } from '@tabler/icons-react'
import LlamaindexPNG from '@/assets/images/llamaindex.png'
import LangChainPNG from '@/assets/images/langchain.png'
import utilNodesPNG from '@/assets/images/utilNodes.png'

// const
import { baseURL } from '@/store/constant'
import { SET_COMPONENT_NODES } from '@/store/actions'
import { Margin } from '@mui/icons-material'
import { BorderRight } from '@mui/icons-material'

// ==============================|| ADD NODES||============================== //
function a11yProps(index) {
    return {
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`
    }
}

const blacklistCategoriesForAgentCanvas = ['Agents', 'Memory', 'Record Manager']
const allowedAgentModel = {}
const exceptions = {
    Memory: ['agentMemory']
}

const AddNodes = ({ nodesData, node, isAgentCanvas }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState('')
    const [nodes, setNodes] = useState({})
    const [open, setOpen] = useState(true)
    const [categoryExpanded, setCategoryExpanded] = useState({})
    const [tabValue, setTabValue] = useState(0)

    const anchorRef = useRef(null)
    const prevOpen = useRef(open)
    const ps = useRef()

    const scrollTop = () => {
        const curr = ps.current
        if (curr) {
            curr.scrollTop = 0
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        filterSearch(searchValue, newValue)
    }

    const addException = () => {
        let nodes = []
        for (const category in exceptions) {
            const nodeNames = exceptions[category]
            nodes.push(...nodesData.filter((nd) => nd.category === category && nodeNames.includes(nd.name)))
        }
        return nodes
    }

    const getSearchedNodes = (value) => {
        if (isAgentCanvas) {
            const nodes = nodesData.filter((nd) => !blacklistCategoriesForAgentCanvas.includes(nd.category))
            nodes.push(...addException())
            const passed = nodes.filter((nd) => {
                const passesName = nd.name.toLowerCase().includes(value.toLowerCase())
                const passesLabel = nd.label.toLowerCase().includes(value.toLowerCase())
                const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
                return passesName || passesCategory || passesLabel
            })
            return passed
        }
        const nodes = nodesData.filter((nd) => nd.category !== 'Multi Agents' && nd.category !== 'Sequential Agents')
        const passed = nodes.filter((nd) => {
            const passesName = nd.name.toLowerCase().includes(value.toLowerCase())
            const passesLabel = nd.label.toLowerCase().includes(value.toLowerCase())
            const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
            return passesName || passesCategory || passesLabel
        })
        return passed
    }

    const filterSearch = (value, newTabValue) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const returnData = getSearchedNodes(value)
                groupByCategory(returnData, newTabValue ?? tabValue, true)
                scrollTop()
            } else if (value === '') {
                groupByCategory(nodesData, newTabValue ?? tabValue)
                scrollTop()
            }
        }, 500)
    }

    const groupByTags = (nodes, newTabValue = 0) => {
        const langchainNodes = nodes.filter((nd) => !nd.tags)
        const llmaindexNodes = nodes.filter((nd) => nd.tags && nd.tags.includes('LlamaIndex'))
        const utilitiesNodes = nodes.filter((nd) => nd.tags && nd.tags.includes('Utilities'))
        if (newTabValue === 0) {
            return langchainNodes
        } else if (newTabValue === 1) {
            return llmaindexNodes
        } else {
            return utilitiesNodes
        }
    }

    const groupByCategory = (nodes, newTabValue, isFilter) => {
        if (isAgentCanvas) {
            const accordianCategories = {}
            const result = nodes.reduce(function (r, a) {
                r[a.category] = r[a.category] || []
                r[a.category].push(a)
                accordianCategories[a.category] = isFilter ? true : false
                return r
            }, Object.create(null))

            const filteredResult = {}
            for (const category in result) {
                // Filter out blacklisted categories
                if (!blacklistCategoriesForAgentCanvas.includes(category)) {
                    // Filter out LlamaIndex nodes
                    const nodes = result[category].filter((nd) => !nd.tags || !nd.tags.includes('LlamaIndex'))
                    if (!nodes.length) continue

                    // Only allow specific models for specific categories
                    if (Object.keys(allowedAgentModel).includes(category)) {
                        const allowedModels = allowedAgentModel[category]
                        filteredResult[category] = nodes.filter((nd) => allowedModels.includes(nd.name))
                    } else {
                        filteredResult[category] = nodes
                    }
                }

                // Allow exceptions
                if (Object.keys(exceptions).includes(category)) {
                    filteredResult[category] = addException()
                }
            }
            setNodes(filteredResult)
            accordianCategories['Multi Agents'] = true
            accordianCategories['Sequential Agents'] = true
            accordianCategories['Memory'] = true
            setCategoryExpanded(accordianCategories)
        } else {
            const taggedNodes = groupByTags(nodes, newTabValue)
            const accordianCategories = {}
            const result = taggedNodes.reduce(function (r, a) {
                r[a.category] = r[a.category] || []
                r[a.category].push(a)
                accordianCategories[a.category] = isFilter ? true : false
                return r
            }, Object.create(null))

            const filteredResult = {}
            for (const category in result) {
                if (category === 'Multi Agents' || category === 'Sequential Agents') {
                    continue
                }
                filteredResult[category] = result[category]
            }
            setNodes(filteredResult)
            setCategoryExpanded(accordianCategories)
        }
    }

    const handleAccordionChange = (category) => (event, isExpanded) => {
        const accordianCategories = { ...categoryExpanded }
        accordianCategories[category] = isExpanded
        setCategoryExpanded(accordianCategories)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const onDragStart = (event, node) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node))
        event.dataTransfer.effectAllowed = 'move'
    }

    const getImage = (tabValue) => {
        if (tabValue === 0) {
            return LangChainPNG
        } else if (tabValue === 1) {
            return LlamaindexPNG
        } else {
            return utilNodesPNG
        }
    }
    useEffect(() => {
        if (nodesData) {
            groupByCategory(nodesData)
            dispatch({ type: SET_COMPONENT_NODES, componentNodes: nodesData })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodesData, dispatch])

    return (
        <>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [-40, 70]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener>
                                <MainCard
                                    content={true}
                                    sx={{ pt: 8, height: '100vh', width: '275px', borderRight: '1px solid #ccc', borderRadius: '0px' }}
                                >
                                    <Box>
                                        <OutlinedInput
                                            // eslint-disable-next-line
                                            autoFocus
                                            sx={{
                                                width: '100%',
                                                height: '32px',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '6px !important'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#000000',
                                                    borderWidth: '1px'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#000000'
                                                },
                                                '& fieldset': {
                                                    borderRadius: '6px !important'
                                                }
                                            }}
                                            id='input-search-node'
                                            value={searchValue}
                                            onChange={(e) => filterSearch(e.target.value)}
                                            placeholder='Search nodes'
                                            startAdornment={
                                                <InputAdornment position='start'>
                                                    <IconSearch stroke={1.5} size='1rem' color={'#D1D5DB'} />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment
                                                    position='end'
                                                    sx={{
                                                        cursor: 'pointer',
                                                        color: '#D1D5DB',
                                                        '&:hover': {
                                                            color: theme.palette.grey[900]
                                                        }
                                                    }}
                                                    title='Clear Search'
                                                >
                                                    <IconX
                                                        stroke={1.5}
                                                        size='1rem'
                                                        onClick={() => filterSearch('')}
                                                        style={{
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </InputAdornment>
                                            }
                                            aria-describedby='search-helper-text'
                                            inputProps={{
                                                'aria-label': 'weight'
                                            }}
                                        />
                                    </Box>
                                    <PerfectScrollbar
                                        containerRef={(el) => {
                                            ps.current = el
                                        }}
                                        style={{
                                            maxHeight: '100vh',
                                            overflowX: 'hidden'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                border: 'none !important'
                                            }}
                                        >
                                            <List
                                                sx={{
                                                    border: 'none !important'
                                                }}
                                            >
                                                {Object.keys(nodes)
                                                    .sort()
                                                    .map((category) => (
                                                        <Accordion
                                                            className='no-padding'
                                                            expanded={categoryExpanded[category] || false}
                                                            onChange={handleAccordionChange(category)}
                                                            key={category}
                                                            disableGutters
                                                            sx={{
                                                                '&:before': {
                                                                    display: 'none'
                                                                }
                                                            }}
                                                        >
                                                            <AccordionSummary
                                                                className='no-padding'
                                                                expandIcon={<ChevronRightIcon />}
                                                                sx={{
                                                                    '& .MuiAccordionSummary-expandIconWrapper': {
                                                                        color: '#000000'
                                                                    },
                                                                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                                                                        transform: 'rotate(90deg)'
                                                                    },
                                                                    height: '32px',
                                                                    minHeight: '32px',
                                                                    border: 'none !important'
                                                                }}
                                                                aria-controls={`nodes-accordian-${category}`}
                                                                id={`nodes-accordian-header-${category}`}
                                                            >
                                                                <Typography
                                                                    variant='h5'
                                                                    sx={{
                                                                        fontWeight: 300
                                                                    }}
                                                                >
                                                                    {category}
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails className='no-padding'>
                                                                {nodes[category].map((node, index) => (
                                                                    <div
                                                                        key={node.name}
                                                                        onDragStart={(event) => onDragStart(event, node)}
                                                                        draggable
                                                                    >
                                                                        <ListItemButton
                                                                            sx={{
                                                                                p: 0,
                                                                                borderRadius: `${customization.borderRadius}px`,
                                                                                cursor: 'move',
                                                                                border: 'none'
                                                                            }}
                                                                        >
                                                                            <ListItem alignItems='center' sx={{ borderBottom: 'none' }}>
                                                                                <ListItemAvatar>
                                                                                    <div
                                                                                        style={{
                                                                                            width: 24,
                                                                                            height: 24,
                                                                                            borderRadius: '50%',
                                                                                            backgroundColor: 'white'
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            style={{
                                                                                                width: '100%',
                                                                                                height: '100%',
                                                                                                objectFit: 'contain'
                                                                                            }}
                                                                                            alt={node.name}
                                                                                            src={`${baseURL}/api/v1/node-icon/${node.name}`}
                                                                                        />
                                                                                    </div>
                                                                                </ListItemAvatar>
                                                                                <ListItemText
                                                                                    sx={{ ml: 1 }}
                                                                                    primary={
                                                                                        <>
                                                                                            <div
                                                                                                style={{
                                                                                                    display: 'flex',
                                                                                                    flexDirection: 'row',
                                                                                                    alignItems: 'center'
                                                                                                }}
                                                                                            >
                                                                                                <span>{node.label}</span>

                                                                                                {node.badge && (
                                                                                                    <Chip
                                                                                                        sx={{
                                                                                                            width: 'max-content',
                                                                                                            fontWeight: 700,
                                                                                                            fontSize: '0.65rem',
                                                                                                            background:
                                                                                                                node.badge === 'DEPRECATING'
                                                                                                                    ? theme.palette.warning
                                                                                                                          .main
                                                                                                                    : theme.palette.teal
                                                                                                                          .main,
                                                                                                            color:
                                                                                                                node.badge !== 'DEPRECATING'
                                                                                                                    ? 'white'
                                                                                                                    : 'inherit'
                                                                                                        }}
                                                                                                        size='small'
                                                                                                        label={node.badge}
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                        </>
                                                                                    }
                                                                                />
                                                                            </ListItem>
                                                                        </ListItemButton>
                                                                    </div>
                                                                ))}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))}
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                    <Box
                                        display='flex'
                                        flexDirection='center'
                                        justifyContent='center'
                                        alignItems='center'
                                        style={{ height: '100%' }}
                                    >
                                        <Box display='flex' flexDirection='center' justifyContent='center'>
                                            <Typography
                                                display='flex'
                                                flexDirection='center'
                                                justifyContent='center'
                                                alignItems='center'
                                                fontSize='20px'
                                                fontWeight='700'
                                                color='#000'
                                            >
                                                $DAI
                                            </Typography>
                                            <IconButton color='#0000008a' href='https://github.com/AgentForge/AgentForge'>
                                                <GithubIcon />
                                            </IconButton>
                                            <IconButton color='#0000008a' href='https://x.com/DFacilitatorAI'>
                                                <svg
                                                    className='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1wmkh38'
                                                    focusable='false'
                                                    aria-hidden='true'
                                                    viewBox='0 0 24 24'
                                                    data-testid='XIcon'
                                                    width='24px'
                                                    style={{ fill: '#0000008a' }}
                                                >
                                                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'></path>
                                                </svg>
                                            </IconButton>
                                            <IconButton
                                                color='#0000008a'
                                                href='https://AgentForge.gitbook.io/AgentForge'
                                            >
                                                <svg
                                                    className='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1wmkh38'
                                                    focusable='false'
                                                    aria-hidden='true'
                                                    viewBox='0 0 24 24'
                                                    data-testid='XIcon'
                                                    width='24px'
                                                    style={{ fill: '#0000008a' }}
                                                >
                                                    <path d='M10.802 17.77a.703.703 0 1 1-.002 1.406.703.703 0 0 1 .002-1.406m11.024-4.347a.703.703 0 1 1 .001-1.406.703.703 0 0 1-.001 1.406m0-2.876a2.176 2.176 0 0 0-2.174 2.174c0 .233.039.465.115.691l-7.181 3.823a2.165 2.165 0 0 0-1.784-.937c-.829 0-1.584.475-1.95 1.216l-6.451-3.402c-.682-.358-1.192-1.48-1.138-2.502.028-.533.212-.947.493-1.107.178-.1.392-.092.62.027l.042.023c1.71.9 7.304 3.847 7.54 3.956.363.169.565.237 1.185-.057l11.564-6.014c.17-.064.368-.227.368-.474 0-.342-.354-.477-.355-.477-.658-.315-1.669-.788-2.655-1.25-2.108-.987-4.497-2.105-5.546-2.655-.906-.474-1.635-.074-1.765.006l-.252.125C7.78 6.048 1.46 9.178 1.1 9.397.457 9.789.058 10.57.006 11.539c-.08 1.537.703 3.14 1.824 3.727l6.822 3.518a2.175 2.175 0 0 0 2.15 1.862 2.177 2.177 0 0 0 2.173-2.14l7.514-4.073c.38.298.853.461 1.337.461A2.176 2.176 0 0 0 24 12.72a2.176 2.176 0 0 0-2.174-2.174' />
                                                </svg>
                                            </IconButton>
                                            <IconButton color='#0000008a' href='https://linktr.ee/AgentForge'>
                                                <svg
                                                    className='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1wmkh38'
                                                    focusable='false'
                                                    aria-hidden='true'
                                                    viewBox='0 0 24 24'
                                                    data-testid='XIcon'
                                                    width='24px'
                                                    style={{ fill: '#0000008a' }}
                                                >
                                                    <path d='m13.511 5.853 4.005-4.117 2.325 2.381-4.201 4.005h5.909v3.305h-5.937l4.229 4.108-2.325 2.334-5.741-5.769-5.741 5.769-2.325-2.325 4.229-4.108H2V8.122h5.909L3.708 4.117l2.325-2.381 4.005 4.117V0h3.473v5.853zM10.038 16.16h3.473v7.842h-3.473V16.16z'></path>
                                                </svg>
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    )
}

AddNodes.propTypes = {
    nodesData: PropTypes.array,
    node: PropTypes.object,
    isAgentCanvas: PropTypes.bool
}

export default AddNodes
