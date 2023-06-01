// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <img src={`/images/pages/logo.svg`} alt={themeConfig.templateName} width={'100'} />
      <CircularProgress disableShrink sx={{ mt: 5 }} color='inherit' />
    </Box>
  )
}

export default FallbackSpinner
