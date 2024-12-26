import { useEffect, useRef, useState, useCallback, useContext } from 'react'
import ReactFlow, { addEdge, Controls, Background, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    REMOVE_DIRTY,
    SET_DIRTY,
    SET_CHATFLOW,
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar as closeSnackbarAction
} from '@/store/actions'
import { omit, cloneDeep } from 'lodash'

// material-ui
import {
    Toolbar,
    Box,
    AppBar,
    Button,
    Fab,
    Typography,
    TextField,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    styled,
    Checkbox,
    Tooltip,
    IconButton,
    Select,
    MenuItem,
    ListItemIcon,
    FormControl,
    ListItemText,
    InputAdornment
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import CanvasNode from './CanvasNode'
import ButtonEdge from './ButtonEdge'
import StickyNote from './StickyNote'
import CanvasHeader from './CanvasHeader'
import AddNodes from './AddNodes'
import TabPanell from '@/ui-component/tabs/TabPanel2'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import DropdownMenu from '@/ui-component/dropdown/DropdownMenu'
import { ChatPopUp } from '@/views/chatmessage/ChatPopUp'
import { VectorStorePopUp } from '@/views/vectorstore/VectorStorePopUp'
import { flowContext } from '@/store/context/ReactFlowContext'
import MainCard from '@/ui-component/cards/MainCard'

// API
import nodesApi from '@/api/nodes'
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// icons
import { IconX, IconRefreshAlert } from '@tabler/icons-react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MessageIcon from '@mui/icons-material/Message'
import WebOutlinedIcon from '@mui/icons-material/WebOutlined'
import ChatIcon from '@mui/icons-material/Chat'
import FormIcon from '@mui/icons-material/Description'
import WebIcon from '@mui/icons-material/Public'
import SmsIcon from '@mui/icons-material/Sms'
import ExtensionIcon from '@mui/icons-material/Extension'
import ApiIcon from '@mui/icons-material/Code'
import BatchIcon from '@mui/icons-material/Storage'
import VoiceIcon from '@mui/icons-material/RecordVoiceOver'
// utils
import {
    getUniqueNodeId,
    initNode,
    rearrangeToolsOrdering,
    getUpsertDetails,
    updateOutdatedNodeData,
    updateOutdatedNodeEdge
} from '@/utils/genericHelper'
import useNotifier from '@/utils/useNotifier'
import { usePrompt } from '@/utils/usePrompt'

// const
import { AgentForge_CREDENTIAL_ID } from '@/store/constant'
import { NoEncryption } from '@mui/icons-material'
import { color } from '@uiw/react-codemirror'

const nodeTypes = { customNode: CanvasNode, stickyNote: StickyNote }
const edgeTypes = { buttonedge: ButtonEdge }

// ==============================|| CANVAS ||============================== //

const Canvas = () => {
    const theme = useTheme()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState(0)
    const handleTabChange = (newTabId) => {
        setActiveTab(newTabId)

        switch (newTabId) {
            case 0:
                console.log('tab:0')
                break
            case 1:
                console.log('tab:1')
                break
            default:
                break
        }
    }
    const { state } = useLocation()
    const templateFlowData = state ? state.templateFlowData : ''
    const URLpath = document.location.pathname.toString().split('/')
    const chatflowId =
        URLpath[URLpath.length - 1] === 'canvas' || URLpath[URLpath.length - 1] === 'agentcanvas' ? '' : URLpath[URLpath.length - 1]
    const isAgentCanvas = URLpath.includes('agentcanvas') ? true : false
    const canvasTitle = URLpath.includes('agentcanvas') ? 'Agent' : 'Chatflow'

    const { confirm } = useConfirm()

    const dispatch = useDispatch()
    const canvas = useSelector((state) => state.canvas)
    const [canvasDataStore, setCanvasDataStore] = useState(canvas)
    const [chatflow, setChatflow] = useState(null)
    const { reactFlowInstance, setReactFlowInstance } = useContext(flowContext)

    // ==============================|| Snackbar ||============================== //

    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    // ==============================|| ReactFlow ||============================== //

    const [nodes, setNodes, onNodesChange] = useNodesState()
    const [edges, setEdges, onEdgesChange] = useEdgesState()

    const [selectedNode, setSelectedNode] = useState(null)
    const [isUpsertButtonEnabled, setIsUpsertButtonEnabled] = useState(false)
    const [isSyncNodesButtonEnabled, setIsSyncNodesButtonEnabled] = useState(false)

    const reactFlowWrapper = useRef(null)

    // ==============================|| Chatflow API ||============================== //

    const getNodesApi = useApi(nodesApi.getAllNodes)
    const createNewChatflowApi = useApi(chatflowsApi.createNewChatflow)
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)
    const getSpecificChatflowApi = useApi(chatflowsApi.getSpecificChatflow)

    // ==============================|| Events & Actions ||============================== //

    const onConnect = (params) => {
        const newEdge = {
            ...params,
            type: 'buttonedge',
            id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`
        }

        const targetNodeId = params.targetHandle.split('-')[0]
        const sourceNodeId = params.sourceHandle.split('-')[0]
        const targetInput = params.targetHandle.split('-')[2]

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === targetNodeId) {
                    setTimeout(() => setDirty(), 0)
                    let value
                    const inputAnchor = node.data.inputAnchors.find((ancr) => ancr.name === targetInput)
                    const inputParam = node.data.inputParams.find((param) => param.name === targetInput)

                    if (inputAnchor && inputAnchor.list) {
                        const newValues = node.data.inputs[targetInput] || []
                        if (targetInput === 'tools') {
                            rearrangeToolsOrdering(newValues, sourceNodeId)
                        } else {
                            newValues.push(`{{${sourceNodeId}.data.instance}}`)
                        }
                        value = newValues
                    } else if (inputParam && inputParam.acceptVariable) {
                        value = node.data.inputs[targetInput] || ''
                    } else {
                        value = `{{${sourceNodeId}.data.instance}}`
                    }
                    node.data = {
                        ...node.data,
                        inputs: {
                            ...node.data.inputs,
                            [targetInput]: value
                        }
                    }
                }
                return node
            })
        )

        setEdges((eds) => addEdge(newEdge, eds))
    }

    const handleLoadFlow = (file) => {
        try {
            const flowData = JSON.parse(file)
            const nodes = flowData.nodes || []

            setNodes(nodes)
            setEdges(flowData.edges || [])
            setTimeout(() => setDirty(), 0)
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteFlow = async () => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete ${canvasTitle} ${chatflow.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                await chatflowsApi.deleteChatflow(chatflow.id)
                localStorage.removeItem(`${chatflow.id}_INTERNAL`)
                navigate(isAgentCanvas ? '/agentflows' : '/')
            } catch (error) {
                enqueueSnackbar({
                    message: typeof error.response.data === 'object' ? error.response.data.message : error.response.data,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        }
    }

    const handleSaveFlow = (chatflowName) => {
        if (reactFlowInstance) {
            const nodes = reactFlowInstance.getNodes().map((node) => {
                const nodeData = cloneDeep(node.data)
                if (Object.prototype.hasOwnProperty.call(nodeData.inputs, AgentForge_CREDENTIAL_ID)) {
                    nodeData.credential = nodeData.inputs[AgentForge_CREDENTIAL_ID]
                    nodeData.inputs = omit(nodeData.inputs, [AgentForge_CREDENTIAL_ID])
                }
                node.data = {
                    ...nodeData,
                    selected: false
                }
                return node
            })

            const rfInstanceObject = reactFlowInstance.toObject()
            rfInstanceObject.nodes = nodes
            const flowData = JSON.stringify(rfInstanceObject)

            if (!chatflow.id) {
                const newChatflowBody = {
                    name: chatflowName,
                    deployed: false,
                    isPublic: false,
                    flowData,
                    type: isAgentCanvas ? 'MULTIAGENT' : 'CHATFLOW'
                }
                createNewChatflowApi.request(newChatflowBody)
            } else {
                const updateBody = {
                    name: chatflowName,
                    flowData
                }
                updateChatflowApi.request(chatflow.id, updateBody)
            }
        }
    }

    // eslint-disable-next-line
    const onNodeClick = useCallback((event, clickedNode) => {
        setSelectedNode(clickedNode)
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === clickedNode.id) {
                    node.data = {
                        ...node.data,
                        selected: true
                    }
                } else {
                    node.data = {
                        ...node.data,
                        selected: false
                    }
                }

                return node
            })
        )
    })

    const onDragOver = useCallback((event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event) => {
            event.preventDefault()
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            let nodeData = event.dataTransfer.getData('application/reactflow')

            // check if the dropped element is valid
            if (typeof nodeData === 'undefined' || !nodeData) {
                return
            }

            nodeData = JSON.parse(nodeData)

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left - 100,
                y: event.clientY - reactFlowBounds.top - 50
            })

            const newNodeId = getUniqueNodeId(nodeData, reactFlowInstance.getNodes())

            const newNode = {
                id: newNodeId,
                position,
                type: nodeData.type !== 'StickyNote' ? 'customNode' : 'stickyNote',
                data: initNode(nodeData, newNodeId)
            }

            setSelectedNode(newNode)
            setNodes((nds) =>
                nds.concat(newNode).map((node) => {
                    if (node.id === newNode.id) {
                        node.data = {
                            ...node.data,
                            selected: true
                        }
                    } else {
                        node.data = {
                            ...node.data,
                            selected: false
                        }
                    }

                    return node
                })
            )
            setTimeout(() => setDirty(), 0)
        },

        // eslint-disable-next-line
        [reactFlowInstance]
    )

    const syncNodes = () => {
        const componentNodes = canvas.componentNodes

        const cloneNodes = cloneDeep(nodes)
        const cloneEdges = cloneDeep(edges)
        let toBeRemovedEdges = []

        for (let i = 0; i < cloneNodes.length; i++) {
            const node = cloneNodes[i]
            const componentNode = componentNodes.find((cn) => cn.name === node.data.name)
            if (componentNode && componentNode.version > node.data.version) {
                const clonedComponentNode = cloneDeep(componentNode)
                cloneNodes[i].data = updateOutdatedNodeData(clonedComponentNode, node.data)
                toBeRemovedEdges.push(...updateOutdatedNodeEdge(cloneNodes[i].data, cloneEdges))
            }
        }

        setNodes(cloneNodes)
        setEdges(cloneEdges.filter((edge) => !toBeRemovedEdges.includes(edge)))
        setDirty()
        setIsSyncNodesButtonEnabled(false)
    }

    const saveChatflowSuccess = () => {
        dispatch({ type: REMOVE_DIRTY })
        enqueueSnackbar({
            message: `${canvasTitle} saved`,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    const errorFailed = (message) => {
        enqueueSnackbar({
            message,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'error',
                persist: true,
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    const setDirty = () => {
        dispatch({ type: SET_DIRTY })
    }

    const checkIfUpsertAvailable = (nodes, edges) => {
        const upsertNodeDetails = getUpsertDetails(nodes, edges)
        if (upsertNodeDetails.length) setIsUpsertButtonEnabled(true)
        else setIsUpsertButtonEnabled(false)
    }

    const checkIfSyncNodesAvailable = (nodes) => {
        const componentNodes = canvas.componentNodes

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            const componentNode = componentNodes.find((cn) => cn.name === node.data.name)
            if (componentNode && componentNode.version > node.data.version) {
                setIsSyncNodesButtonEnabled(true)
                return
            }
        }

        setIsSyncNodesButtonEnabled(false)
    }

    const StyledAccordion = styled(Accordion)(({ theme }) => ({
        '&.MuiAccordion-root': {
            boxShadow: 'none',
            '&:before': {
                display: 'none'
            },
            '&.Mui-expanded': {
                margin: 0
            }
        }
    }))

    const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
        padding: 0,
        minHeight: '48px !important',
        '& .MuiAccordionSummary-content': {
            margin: '0 !important'
        }
    }))

    const TableHeader = styled(Box)(({ theme }) => ({
        display: 'grid',
        gridTemplateColumns: '30px 120px 1fr 100px',
        backgroundColor: '#F5F5F5',
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }))

    const TableRow = styled(Box)(({ theme }) => ({
        display: 'grid',
        gridTemplateColumns: '30px 120px 1fr 100px',
        padding: theme.spacing(1),
        alignItems: 'center'
    }))

    //   const WebsiteChatbot = () => {
    const [expanded, setExpanded] = useState(['general', 'fields', 'style'])

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        if (isExpanded) {
            setExpanded([...expanded, panel])
        } else {
            setExpanded(expanded.filter((item) => item !== panel))
        }
    }
    // }

    const FormLabel = ({ children, tooltip }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant='body2' color='text.secondary'>
                {children}
            </Typography>
            {tooltip && (
                <Tooltip title={tooltip}>
                    <IconButton size='small' sx={{ ml: 0.5 }}>
                        <HelpOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    )

    const StyledSelect = styled(Select)(({ theme }) => ({
        '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),
            padding: theme.spacing(1.5)
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2'
        }
    }))

    const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
        padding: theme.spacing(1),
        '&.MuiMenuItem-root': {
            gap: theme.spacing(1)
        },
        '& .MuiListItemIcon-root': {
            minWidth: 'auto'
        }
    }))

    const [selected, setSelected] = useState('website-chatbot')

    const handleChange = (event) => {
        setSelected(event.target.value)
    }
    const renderValue = () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <WebOutlinedIcon />
            <span>Website Chatbot</span>
        </div>
    )
    // ==============================|| useEffect ||============================== //

    // Get specific chatflow successful
    useEffect(() => {
        if (getSpecificChatflowApi.data) {
            const chatflow = getSpecificChatflowApi.data
            const initialFlow = chatflow.flowData ? JSON.parse(chatflow.flowData) : []
            setNodes(initialFlow.nodes || [])
            setEdges(initialFlow.edges || [])
            dispatch({ type: SET_CHATFLOW, chatflow })
        } else if (getSpecificChatflowApi.error) {
            errorFailed(`Failed to retrieve ${canvasTitle}: ${getSpecificChatflowApi.error.response.data.message}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificChatflowApi.data, getSpecificChatflowApi.error])

    // Create new chatflow successful
    useEffect(() => {
        if (createNewChatflowApi.data) {
            const chatflow = createNewChatflowApi.data
            dispatch({ type: SET_CHATFLOW, chatflow })
            saveChatflowSuccess()
            window.history.replaceState(state, null, `/${isAgentCanvas ? 'agentcanvas' : 'canvas'}/${chatflow.id}`)
        } else if (createNewChatflowApi.error) {
            errorFailed(`Failed to save ${canvasTitle}: ${createNewChatflowApi.error.response.data.message}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createNewChatflowApi.data, createNewChatflowApi.error])

    // Update chatflow successful
    useEffect(() => {
        if (updateChatflowApi.data) {
            dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data })
            saveChatflowSuccess()
        } else if (updateChatflowApi.error) {
            errorFailed(`Failed to save ${canvasTitle}: ${updateChatflowApi.error.response.data.message}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateChatflowApi.data, updateChatflowApi.error])

    useEffect(() => {
        setChatflow(canvasDataStore.chatflow)
        if (canvasDataStore.chatflow) {
            const flowData = canvasDataStore.chatflow.flowData ? JSON.parse(canvasDataStore.chatflow.flowData) : []
            checkIfUpsertAvailable(flowData.nodes || [], flowData.edges || [])
            checkIfSyncNodesAvailable(flowData.nodes || [])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasDataStore.chatflow])

    // Initialization
    useEffect(() => {
        setIsSyncNodesButtonEnabled(false)
        setIsUpsertButtonEnabled(false)
        if (chatflowId) {
            getSpecificChatflowApi.request(chatflowId)
        } else {
            if (localStorage.getItem('duplicatedFlowData')) {
                handleLoadFlow(localStorage.getItem('duplicatedFlowData'))
                setTimeout(() => localStorage.removeItem('duplicatedFlowData'), 0)
            } else {
                setNodes([])
                setEdges([])
            }
            dispatch({
                type: SET_CHATFLOW,
                chatflow: {
                    name: `Untitled ${canvasTitle}`
                }
            })
        }

        getNodesApi.request()

        // Clear dirty state before leaving and remove any ongoing test triggers and webhooks
        return () => {
            setTimeout(() => dispatch({ type: REMOVE_DIRTY }), 0)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setCanvasDataStore(canvas)
    }, [canvas])

    useEffect(() => {
        function handlePaste(e) {
            const pasteData = e.clipboardData.getData('text')
            //TODO: prevent paste event when input focused, temporary fix: catch chatflow syntax
            if (pasteData.includes('{"nodes":[') && pasteData.includes('],"edges":[')) {
                handleLoadFlow(pasteData)
            }
        }

        window.addEventListener('paste', handlePaste)

        return () => {
            window.removeEventListener('paste', handlePaste)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (templateFlowData && templateFlowData.includes('"nodes":[') && templateFlowData.includes('],"edges":[')) {
            handleLoadFlow(templateFlowData)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateFlowData])

    usePrompt('You have unsaved changes! Do you want to navigate away?', canvasDataStore.isDirty)

    return (
        <>
            <Box>
                <AppBar
                    enableColorOnDark
                    position='fixed'
                    color='inherit'
                    elevation={1}
                    sx={{
                        bgcolor: theme.palette.background.default,
                        height: '53px',
                        borderBottom: '0.5px solid #D9D9E0',
                        boxShadow: 'none'
                    }}
                >
                    <Toolbar>
                        <CanvasHeader
                            chatflow={chatflow}
                            handleSaveFlow={handleSaveFlow}
                            handleDeleteFlow={handleDeleteFlow}
                            handleLoadFlow={handleLoadFlow}
                            isAgentCanvas={isAgentCanvas}
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                        />
                    </Toolbar>
                </AppBar>

                {/* <TabPanell activeTab={activeTab}> */}
                {activeTab === 0 && (
                    <div>
                        <Box sx={{ pt: '70px', height: '100vh', width: '100%' }}>
                            <div className='reactflow-parent-wrapper'>
                                <div className='reactflow-wrapper' ref={reactFlowWrapper}>
                                    <ReactFlow
                                        nodes={nodes}
                                        edges={edges}
                                        onNodesChange={onNodesChange}
                                        onNodeClick={onNodeClick}
                                        onEdgesChange={onEdgesChange}
                                        onDrop={onDrop}
                                        onDragOver={onDragOver}
                                        onNodeDragStop={setDirty}
                                        nodeTypes={nodeTypes}
                                        edgeTypes={edgeTypes}
                                        onConnect={onConnect}
                                        onInit={setReactFlowInstance}
                                        fitView
                                        deleteKeyCode={canvas.canvasDialogShow ? null : ['Delete']}
                                        minZoom={0.1}
                                        className='chatflow-canvas'
                                    >
                                        <Controls
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        />
                                        <Background color='#aaa' gap={16} />
                                        <AddNodes isAgentCanvas={isAgentCanvas} nodesData={getNodesApi.data} node={selectedNode} />
                                        {isSyncNodesButtonEnabled && (
                                            <Fab
                                                sx={{
                                                    left: 40,
                                                    top: 20,
                                                    color: 'white',
                                                    background: 'orange',
                                                    '&:hover': {
                                                        background: 'orange',
                                                        backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`
                                                    }
                                                }}
                                                size='small'
                                                aria-label='sync'
                                                title='Sync Nodes'
                                                onClick={() => syncNodes()}
                                            >
                                                <IconRefreshAlert />
                                            </Fab>
                                        )}
                                        {isUpsertButtonEnabled && <VectorStorePopUp chatflowid={chatflowId} />}
                                    </ReactFlow>
                                </div>
                            </div>
                        </Box>
                        <ConfirmDialog />
                    </div>
                )}
                {activeTab === 1 && (
                    <div role='tabpanel' hidden={activeTab !== 1}>
                        <div>
                            <Box sx={{ height: '100vh', width: '100%',
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2,
                    position: 'fixed',
                   
                    
                    padding: '2px'
                }}>
                
            
                <Typography variant='h4' component='h1'>
                Coming Soon
                </Typography>
                <Typography variant='body1'>This feature will be available soon!</Typography>
                            </Box>
                        </div>
                    </div>
                )}

                {/* </TabPanell> */}
            </Box>
        </>
    )
}

export default Canvas
