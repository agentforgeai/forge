import React, { useState } from 'react'
import { FormControl, Select, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import ArticleIcon from '@mui/icons-material/Article'
import LanguageIcon from '@mui/icons-material/Language'
import SmsIcon from '@mui/icons-material/Sms'
import ExtensionIcon from '@mui/icons-material/Extension'
import ApiIcon from '@mui/icons-material/Api'
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'

const InterfaceSelector = () => {
    const [selected, setSelected] = useState('Chat Assistant')

    const menuItems = [
        { value: 'Chat Assistant', icon: <ChatIcon sx={{ width: 20, color: '#1C2024' }} />, label: 'Chat Assistant' },
        { value: 'Form', icon: <ArticleIcon sx={{ width: 20, color: '#1C2024' }} />, label: 'Form' },
        { value: 'Website Chatbot', icon: <LanguageIcon sx={{ width: 20, color: '#1C2024' }} />, label: 'Website Chatbot' },
        { value: 'WhatsApp/SMS', icon: <SmsIcon sx={{ width: 20, color: '#1C2024' }} />, label: 'WhatsApp/SMS' },
        { value: 'Chrome Extension', icon: <ExtensionIcon sx={{ width: 20, color: '#1C2024' }} />, label: 'Chrome Extension' },
        { value: 'API', icon: <ApiIcon sx={{ width: 20, color: '#1C2024' }} />, label: 'API' },
        { value: 'Batch', icon: <BatchPredictionIcon sx={{ width: 20, color: '#1C2024' }} />, label: 'Batch' },
        { value: 'Voice Assistant', icon: <RecordVoiceOverIcon sx={{ width: 20, color: '#1C2024' }} />, label: 'Voice Assistant' }
    ]

    const handleChange = (event) => {
        setSelected(event.target.value)
    }

    const renderValue = (value) => {
        const selectedItem = menuItems.find((item) => item.value === value)
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedItem?.icon}
                <span>{selectedItem?.label}</span>
            </div>
        )
    }

    return (
        <FormControl sx={{ minWidth: '100%' }}>
            <Select
                value={selected}
                onChange={handleChange}
                renderValue={renderValue}
                sx={{
                    backgroundColor: '#F0F0F3',
                    height: '38px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D9D9E0',
                        borderRadius: '4px'
                    },
                    '& .MuiSelect-select': {
                        display: 'flex',

                        borderRadius: '4px',
                        alignItems: 'center',
                        gap: 1,
                        padding: '8px 14px',
                        backgroundColor: '#F0F0F3'
                    }
                }}
                size='small'
            >
                {menuItems.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default InterfaceSelector
