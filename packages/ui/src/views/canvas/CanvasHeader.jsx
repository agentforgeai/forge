import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, Typography, Stack, TextField, Button, Tabs, Tab, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
// icons
import { IconSettings, IconChevronLeft, IconDeviceFloppy, IconPencil, IconCheck, IconX, IconCode } from '@tabler/icons-react'
import { ShareOutlined, PlayArrow, InfoOutlined, SaveOutlined } from '@mui/icons-material'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

// project imports
import Settings from '@/views/settings'
import SaveChatflowDialog from '@/ui-component/dialog/SaveChatflowDialog'
import NavigationTab from '../../ui-component/tabs/NavigationTab'
import BreadcrumbNav from '@/ui-component/breadcrumb/BreadcrumbNav'
import APICodeDialog from '@/views/chatflows/APICodeDialog'
import ViewMessagesDialog from '@/ui-component/dialog/ViewMessagesDialog'
import ChatflowConfigurationDialog from '@/ui-component/dialog/ChatflowConfigurationDialog'
import UpsertHistoryDialog from '@/views/vectorstore/UpsertHistoryDialog'
import { useDialog } from '@/contexts/DialogContext'
import WalletConnection from '@/ui-component/wallet/WalletConnection'
// API
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'

// utils
import { generateExportFlowData } from '@/utils/genericHelper'
import { uiBaseURL } from '@/store/constant'
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction, SET_CHATFLOW } from '@/store/actions'
import ViewLeadsDialog from '@/ui-component/dialog/ViewLeadsDialog'
import ExportAsTemplateDialog from '@/ui-component/dialog/ExportAsTemplateDialog'
import Logo from '../../assets/images/logo.png'
// ==============================|| CANVAS HEADER ||============================== //

const CanvasHeader = ({ chatflow, isAgentCanvas, handleSaveFlow, handleDeleteFlow, handleLoadFlow, activeTab, onTabChange }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const flowNameRef = useRef()
    const settingsRef = useRef()

    const [isEditingFlowName, setEditingFlowName] = useState(null)
    const [flowName, setFlowName] = useState('')
    const [isSettingsOpen, setSettingsOpen] = useState(false)
    const [flowDialogOpen, setFlowDialogOpen] = useState(false)
    const [apiDialogOpen, setAPIDialogOpen] = useState(false)
    const [apiDialogProps, setAPIDialogProps] = useState({})
    const [viewMessagesDialogOpen, setViewMessagesDialogOpen] = useState(false)
    const [viewMessagesDialogProps, setViewMessagesDialogProps] = useState({})
    const [viewLeadsDialogOpen, setViewLeadsDialogOpen] = useState(false)
    const [viewLeadsDialogProps, setViewLeadsDialogProps] = useState({})
    const [upsertHistoryDialogOpen, setUpsertHistoryDialogOpen] = useState(false)
    const [upsertHistoryDialogProps, setUpsertHistoryDialogProps] = useState({})
    const [chatflowConfigurationDialogOpen, setChatflowConfigurationDialogOpen] = useState(false)
    const [chatflowConfigurationDialogProps, setChatflowConfigurationDialogProps] = useState({})

    const [exportAsTemplateDialogOpen, setExportAsTemplateDialogOpen] = useState(false)
    const [exportAsTemplateDialogProps, setExportAsTemplateDialogProps] = useState({})
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const title = isAgentCanvas ? 'Agents' : 'Chatflow'
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)
    const canvas = useSelector((state) => state.canvas)

    const { showComingSoon } = useDialog()

    const onSettingsItemClick = (setting) => {
        setSettingsOpen(false)

        if (setting === 'deleteChatflow') {
            handleDeleteFlow()
        } else if (setting === 'viewMessages') {
            setViewMessagesDialogProps({
                title: 'View Messages',
                chatflow: chatflow
            })
            setViewMessagesDialogOpen(true)
        } else if (setting === 'viewLeads') {
            setViewLeadsDialogProps({
                title: 'View Leads',
                chatflow: chatflow
            })
            setViewLeadsDialogOpen(true)
        } else if (setting === 'saveAsTemplate') {
            if (canvas.isDirty) {
                enqueueSnackbar({
                    message: 'Please save the flow before exporting as template',
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
                return
            }
            setExportAsTemplateDialogProps({
                title: 'Export As Template',
                chatflow: chatflow
            })
            setExportAsTemplateDialogOpen(true)
        } else if (setting === 'viewUpsertHistory') {
            setUpsertHistoryDialogProps({
                title: 'View Upsert History',
                chatflow: chatflow
            })
            setUpsertHistoryDialogOpen(true)
        } else if (setting === 'chatflowConfiguration') {
            setChatflowConfigurationDialogProps({
                title: `${title} Configuration`,
                chatflow: chatflow
            })
            setChatflowConfigurationDialogOpen(true)
        } else if (setting === 'duplicateChatflow') {
            try {
                let flowData = chatflow.flowData
                const parsedFlowData = JSON.parse(flowData)
                flowData = JSON.stringify(parsedFlowData)
                localStorage.setItem('duplicatedFlowData', flowData)
                window.open(`${uiBaseURL}/${isAgentCanvas ? 'agentcanvas' : 'canvas'}`, '_blank')
            } catch (e) {
                console.error(e)
            }
        } else if (setting === 'exportChatflow') {
            try {
                const flowData = JSON.parse(chatflow.flowData)
                let dataStr = JSON.stringify(generateExportFlowData(flowData), null, 2)
                let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

                let exportFileDefaultName = `${chatflow.name} ${title}.json`

                let linkElement = document.createElement('a')
                linkElement.setAttribute('href', dataUri)
                linkElement.setAttribute('download', exportFileDefaultName)
                linkElement.click()
            } catch (e) {
                console.error(e)
            }
        }
    }

    const onUploadFile = (file) => {
        setSettingsOpen(false)
        handleLoadFlow(file)
    }

    const submitFlowName = () => {
        if (chatflow.id) {
            const updateBody = {
                name: flowNameRef.current.value
            }
            updateChatflowApi.request(chatflow.id, updateBody)
        }
    }

    const onAPIDialogClick = () => {
        // If file type is file, isFormDataRequired = true
        let isFormDataRequired = false
        try {
            const flowData = JSON.parse(chatflow.flowData)
            const nodes = flowData.nodes
            for (const node of nodes) {
                if (node.data.inputParams.find((param) => param.type === 'file')) {
                    isFormDataRequired = true
                    break
                }
            }
        } catch (e) {
            console.error(e)
        }

        // If sessionId memory, isSessionMemory = true
        let isSessionMemory = false
        try {
            const flowData = JSON.parse(chatflow.flowData)
            const nodes = flowData.nodes
            for (const node of nodes) {
                if (node.data.inputParams.find((param) => param.name === 'sessionId')) {
                    isSessionMemory = true
                    break
                }
            }
        } catch (e) {
            console.error(e)
        }

        setAPIDialogProps({
            title: 'Embed in website or use as API',
            chatflowid: chatflow.id,
            chatflowApiKeyId: chatflow.apikeyid,
            isFormDataRequired,
            isSessionMemory,
            isAgentCanvas
        })
        setAPIDialogOpen(true)
    }

    const onSaveChatflowClick = () => {
        if (chatflow.id) handleSaveFlow(flowName)
        else setFlowDialogOpen(true)
    }

    const onConfirmSaveName = (flowName) => {
        setFlowDialogOpen(false)
        handleSaveFlow(flowName)
    }

    const ActionButton = styled(Button)(({ theme }) => ({
        textTransform: 'none',        
        padding: '6px 16px',
        color: '#374151',
        backgroundColor: '#F3F4F6',
        '&:hover': {
            backgroundColor: '#E5E7EB'
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
        backgroundColor: '#111827',
        '&:hover': {
            backgroundColor: '#374151'
        }
    }))

    useEffect(() => {
        if (updateChatflowApi.data) {
            setFlowName(updateChatflowApi.data.name)
            dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data })
        }
        setEditingFlowName(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateChatflowApi.data])

    useEffect(() => {
        if (chatflow) {
            setFlowName(chatflow.name)
            // if configuration dialog is open, update its data
            if (chatflowConfigurationDialogOpen) {
                setChatflowConfigurationDialogProps({
                    title: `${title} Configuration`,
                    chatflow
                })
            }
        }
    }, [chatflow, title, chatflowConfigurationDialogOpen])

    return (
        <>
            <Stack flexDirection='row' justifyContent='space-between' sx={{ width: '100%' }}>
                <Stack flexDirection='row' alignItems='center'>
                    <Box>
                        <Stack flexDirection='row' alignItems='center'>
                            <Box
                                component='img'
                                sx={{
                                    height: 24,
                                    marginInlineEnd: '8px'
                                }}
                                alt='Logo'
                                src={Logo}
                            />
                            <NavigationTab activeTab={activeTab} onTabChange={onTabChange} />
                        </Stack>
                    </Box>
                </Stack>
                <Box>
                    <BreadcrumbNav />
                </Box>
                <Box flexDirection='row' alignItems='center'  sx={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 1,
            }} >
                    
                        <WalletConnection />
                </Box>               
            </Stack>
            <Settings
                chatflow={chatflow}
                isSettingsOpen={isSettingsOpen}
                anchorEl={settingsRef.current}
                onClose={() => setSettingsOpen(false)}
                onSettingsItemClick={onSettingsItemClick}
                onUploadFile={onUploadFile}
                isAgentCanvas={isAgentCanvas}
            />
            <SaveChatflowDialog
                show={flowDialogOpen}
                dialogProps={{
                    title: `Save New ${title}`,
                    confirmButtonName: 'Save',
                    cancelButtonName: 'Cancel'
                }}
                onCancel={() => setFlowDialogOpen(false)}
                onConfirm={onConfirmSaveName}
            />
            {apiDialogOpen && <APICodeDialog show={apiDialogOpen} dialogProps={apiDialogProps} onCancel={() => setAPIDialogOpen(false)} />}
            <ViewMessagesDialog
                show={viewMessagesDialogOpen}
                dialogProps={viewMessagesDialogProps}
                onCancel={() => setViewMessagesDialogOpen(false)}
            />
            <ViewLeadsDialog show={viewLeadsDialogOpen} dialogProps={viewLeadsDialogProps} onCancel={() => setViewLeadsDialogOpen(false)} />
            {exportAsTemplateDialogOpen && (
                <ExportAsTemplateDialog
                    show={exportAsTemplateDialogOpen}
                    dialogProps={exportAsTemplateDialogProps}
                    onCancel={() => setExportAsTemplateDialogOpen(false)}
                />
            )}
            <UpsertHistoryDialog
                show={upsertHistoryDialogOpen}
                dialogProps={upsertHistoryDialogProps}
                onCancel={() => setUpsertHistoryDialogOpen(false)}
            />
            <ChatflowConfigurationDialog
                key='chatflowConfiguration'
                show={chatflowConfigurationDialogOpen}
                dialogProps={chatflowConfigurationDialogProps}
                onCancel={() => setChatflowConfigurationDialogOpen(false)}
            />
        </>
    )
}

CanvasHeader.propTypes = {
    chatflow: PropTypes.object,
    handleSaveFlow: PropTypes.func,
    handleDeleteFlow: PropTypes.func,
    handleLoadFlow: PropTypes.func,
    isAgentCanvas: PropTypes.bool,
    activeTab: PropTypes.number.isRequired,
    onTabChange: PropTypes.func.isRequired
}

export default CanvasHeader
