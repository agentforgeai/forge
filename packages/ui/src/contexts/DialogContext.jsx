import { createContext, useContext, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

const DialogContext = createContext()

export const DialogProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)

    const showComingSoon = () => {
        setIsOpen(true)
    }

    const hideDialog = () => {
        setIsOpen(false)
    }

    return (
        <DialogContext.Provider value={{ showComingSoon }}>
            {children}
            <Dialog
                open={isOpen}
                onClose={hideDialog}
                PaperProps={{
                    sx: {
                        minWidth: '300px',
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '4px'
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant='h5'>Coming Soon</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant='body1'>This feature will be available soon!</Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', paddingTop: '20px' }}>
                    <Button
                        onClick={hideDialog}
                        variant='contained'
                        sx={{
                            minWidth: '100px',
                            backgroundColor: '#000',
                            '&:hover': {
                                backgroundColor: '#555'
                            }
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </DialogContext.Provider>
    )
}

export const useDialog = () => {
    const context = useContext(DialogContext)
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider')
    }
    return context
}
