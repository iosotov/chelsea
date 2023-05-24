// ** MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { SetStateAction } from 'react'
import { CalendarColors } from 'src/types/apps/calendarTypes'

type SidebarLeftType = {
  mdAbove: boolean
  selectedTasks: number[]
  setSelectedTasks: React.Dispatch<SetStateAction<number[]>>
  calendarsColor: CalendarColors
  leftSidebarOpen: boolean
  leftSidebarWidth: number
  handleLeftSidebarToggle: () => void
  handleAddTaskSidebarToggle: () => void
}


const SidebarLeft = (props: SidebarLeftType) => {
  const {
    mdAbove,
    selectedTasks,
    setSelectedTasks,
    calendarsColor,
    leftSidebarOpen,
    leftSidebarWidth,
    handleLeftSidebarToggle,
    handleAddTaskSidebarToggle
  } = props

  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]: string[], idx) => {
      return (
        <FormControlLabel
          key={key}
          label={key}
          control={
            <Checkbox
              color={value as ThemeColor}
              checked={selectedTasks.includes(idx)}
              onChange={e => {
                console.log(e.target.checked, selectedTasks)
                if (e.target.checked) setSelectedTasks(state => ([...state, idx]))
                else setSelectedTasks(state => state.filter(s => s !== idx))
              }}
            />
          }
        />
      )
    })
    : null

  const handleSidebarToggleSidebar = () => {
    handleAddTaskSidebarToggle()

    // dispatch(handleSelectEvent(null))
  }

  if (renderFilters) {
    return (
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          disableAutoFocus: true,
          disableScrollLock: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 2,
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            borderRadius: 1,
            boxShadow: 'none',
            width: leftSidebarWidth,
            borderTopRightRadius: 0,
            alignItems: 'flex-start',
            borderBottomRightRadius: 0,
            p: theme => theme.spacing(5),
            zIndex: mdAbove ? 2 : 'drawer',
            position: mdAbove ? 'static' : 'absolute'
          },
          '& .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute'
          }
        }}
      >
        <Button fullWidth variant='contained' onClick={handleSidebarToggleSidebar}>
          Add Event
        </Button>

        <Typography variant='caption' sx={{ mt: 7, mb: 2, textTransform: 'uppercase' }}>
          Calendars
        </Typography>
        <FormControlLabel
          label='View All'
          control={
            <Checkbox
              color='secondary'
              checked={selectedTasks.length === 3}
              onChange={e => {
                if (e.target.checked) setSelectedTasks([0, 1, 2])
                else setSelectedTasks([])
              }} />
          }
        />
        {renderFilters}
      </Drawer>
    )
  } else {
    return null
  }
}

export default SidebarLeft
