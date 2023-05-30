// ** React Imports
import { useEffect, useCallback, useRef, useState, ChangeEvent } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import MuiDialog from '@mui/material/Dialog'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'
import MuiAutocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'

// ** Third Party Imports
import { useDebounce } from 'use-debounce';

// ** Types Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs Imports
import { ProfileQuickSearchType } from 'src/store/api/profileApiSlice'
import { useGetProfileQuickSearchQuery, useGetUserActivityQuery } from 'src/store/api/apiHooks'
import { Chip, CircularProgress, Stack } from '@mui/material'
import { paymentStatusColor } from 'src/pages/profiles/list'
import { useAppSelector } from 'src/store/hooks'
import { selectQuickSearchLinks } from 'src/store/userSlice'

interface Props {
  hidden: boolean
  settings: Settings
}

interface DefaultSuggestionsProps {
  setOpenDialog: (val: boolean) => void
  data: DefaultSuggestionsType[]
}

interface NoResultProps {
  value: string
  setOpenDialog: (val: boolean) => void
}

export interface DefaultSuggestionsType {
  category: string
  suggestions: {
    link: string
    icon: string
    suggestion: string
  }[]
}

export const defaultSuggestionsData: DefaultSuggestionsType[] = [
  {
    category: 'Popular Searches',
    suggestions: [
      {
        icon: 'mdi:account-group',
        suggestion: 'Profiles',
        link: '/profiles/list'
      },
      {
        icon: 'mdi:clipboard-search-outline',
        suggestion: 'Tasks',
        link: '/tasks/list'
      },
      {
        icon: 'mdi:credit-card-search-outline',
        suggestion: 'Transactions',
        link: '/transactions/list'
      },
      {
        icon: 'mdi:account-plus-outline',
        suggestion: 'Create Profile',
        link: '/profiles/create'
      },
    ]
  },
]

// ** Styled Autocomplete component
const Autocomplete = styled(MuiAutocomplete)(({ theme }) => ({
  '& fieldset': {
    border: 0
  },
  '& + .MuiAutocomplete-popper': {
    '& .MuiAutocomplete-listbox': {
      paddingTop: 0,
      height: '100%',
      maxHeight: 'inherit',
      '& .MuiListSubheader-root': {
        top: 0,
        fontWeight: 400,
        lineHeight: '15px',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        color: theme.palette.text.disabled
      }
    },
    '& .MuiAutocomplete-paper': {
      border: 0,
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none'
    },
    '& .MuiListItem-root.suggestion': {
      padding: 0,
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex'
      },
      '&.Mui-focused.Mui-focusVisible, &:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '& .MuiListItemButton-root: hover': {
        backgroundColor: 'transparent'
      },
      '&:not(:hover)': {
        '& .MuiListItemSecondaryAction-root': {
          display: 'none'
        },
        '&.Mui-focused, &.Mui-focused.Mui-focusVisible:not(:hover)': {
          '& .MuiListItemSecondaryAction-root': {
            display: 'flex'
          }
        },
        [theme.breakpoints.down('sm')]: {
          '&.Mui-focused:not(.Mui-focusVisible) .MuiListItemSecondaryAction-root': {
            display: 'none'
          }
        }
      }
    },
    '& .MuiAutocomplete-noOptions': {
      display: 'grid',
      minHeight: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(10)
    }
  }
}))

// ** Styled Dialog component
const Dialog = styled(MuiDialog)({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)'
  },
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    '&:not(.MuiDialog-paperFullScreen)': {
      height: '100%',
      maxHeight: 550
    }
  }
})

const NoResult = ({ value }: NoResultProps) => {
  return value.length > 0 ? (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ mb: 2.5, color: 'text.primary' }}>
        <Icon icon='mdi:file-remove-outline' fontSize='5rem' />
      </Box>
      <Typography variant='h6' sx={{ mb: 11.5, wordWrap: 'break-word' }}>
        No results for{' '}
        <Typography variant='h6' component='span' sx={{ wordWrap: 'break-word' }}>
          {`"${value}"`}
        </Typography>
      </Typography>
    </Box>
  ) : null
}


const DefaultSuggestions = ({ setOpenDialog, data }: DefaultSuggestionsProps) => {
  return (
    <Grid container sx={{ ml: 6 }}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Typography component='p' variant='overline' sx={{ lineHeight: 1.25, color: 'text.disabled', minWidth: 200 }}>
            {item.category}
          </Typography>
          <List sx={{ py: 2.5 }}>
            {item.suggestions.map((suggestionItem, index2) => (
              <ListItem key={index2} sx={{ py: 2 }} disablePadding>
                <Box
                  component={Link}
                  href={suggestionItem.link}
                  onClick={() => setOpenDialog(false)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 2.5 },
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover > *': { color: 'primary.main' }
                  }}
                >
                  <Icon icon={suggestionItem.icon} fontSize={20} />
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {suggestionItem.suggestion}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Grid>
      ))}
    </Grid>
  )
}

const AutocompleteComponent = ({ hidden, settings }: Props) => {
  // ** States
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [debouncedSearchValue] = useDebounce(searchValue, 200); // debounce delay is 300ms

  // API HOOKS
  const { data: options = [], isLoading, isFetching } = useGetProfileQuickSearchQuery(debouncedSearchValue, { skip: !debouncedSearchValue })
  useGetUserActivityQuery(openDialog, { refetchOnMountOrArgChange: true })

  // GLOBAL STATE
  const userActivity = useAppSelector(state => selectQuickSearchLinks(state))

  // ** Hooks & Vars
  const theme = useTheme()
  const router = useRouter()
  const { layout } = settings
  const wrapper = useRef<HTMLDivElement>(null)
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    if (!openDialog) {
      setSearchValue('')
    }
  }, [openDialog])

  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])

  // Handle click event on a list item in search result
  const handleOptionClick = (obj: ProfileQuickSearchType) => {
    setSearchValue('')
    setOpenDialog(false)
    if (obj.profileId) {
      router.push({
        pathname: `/profiles/${obj.profileId}/debts/`
      })
    }
  }

  // Handle ESC & shortcut keys keydown events
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      // ** Shortcut keys to open searchbox (Ctrl + /)
      if (!openDialog && event.ctrlKey && event.which === 191) {
        setOpenDialog(true)
      }
    },
    [openDialog]
  )

  // Handle shortcut keys keyup events
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      // ** ESC key to close searchbox
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false)
      }
    },
    [openDialog]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])

  if (!isMounted) {
    return null
  } else {
    return (
      <Box
        ref={wrapper}
        onClick={() => !openDialog && setOpenDialog(true)}
        sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
      >
        <IconButton color='inherit' sx={!hidden && layout === 'vertical' ? { mr: 1, ml: -2.75 } : {}}>
          <Icon icon='mdi:magnify' />
        </IconButton>
        {!hidden && layout === 'vertical' ? (
          <Typography sx={{ userSelect: 'none', color: 'text.disabled' }}>Search (Ctrl+/)</Typography>
        ) : null}
        {openDialog && (
          <Dialog fullWidth open={openDialog} fullScreen={fullScreenDialog} onClose={() => setOpenDialog(false)}>
            <Box sx={{ top: 0, width: '100%', position: 'sticky' }}>
              <Autocomplete
                autoHighlight
                disablePortal
                options={options}
                id='appBar-search'
                isOptionEqualToValue={() => true}
                onInputChange={(event, value: string) => setSearchValue(value)}
                onChange={(event, obj) => handleOptionClick(obj as ProfileQuickSearchType)}
                noOptionsText={<NoResult value={debouncedSearchValue} setOpenDialog={setOpenDialog} />}
                getOptionLabel={(option: ProfileQuickSearchType | unknown) => (option as ProfileQuickSearchType).firstName || ''}
                sx={{
                  '& + .MuiAutocomplete-popper': {
                    ...(searchValue.length
                      ? {
                        overflow: 'auto',
                        maxHeight: 'calc(100vh - 69px)',
                        borderTop: `1px solid ${theme.palette.divider}`,
                        height: fullScreenDialog ? 'calc(100vh - 69px)' : 481,
                        '& .MuiListSubheader-root': { p: theme.spacing(3.75, 6, 0.75) }
                      }
                      : {
                        '& .MuiAutocomplete-listbox': { pb: 0 }
                      })
                  }
                }}
                renderInput={(params: AutocompleteRenderInputParams) => {
                  return (
                    <TextField
                      {...params}
                      value={searchValue}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                      inputRef={input => {
                        if (input) {
                          if (openDialog) {
                            input.focus()
                          } else {
                            input.blur()
                          }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { p: `${theme.spacing(3.75, 6)} !important` },
                        startAdornment: (
                          <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                            {isLoading || isFetching ? <CircularProgress /> : <Icon icon='mdi:magnify' />}
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position='end'
                            onClick={() => setOpenDialog(false)}
                            sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                          >
                            {!hidden ? <Typography sx={{ mr: 2.5, color: 'text.disabled' }}>[esc]</Typography> : null}
                            <IconButton size='small' sx={{ p: 1 }}>
                              <Icon icon='mdi:close' fontSize={20} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )
                }}
                renderOption={(props, option: ProfileQuickSearchType | unknown) => {
                  console.log(option)

                  return searchValue.length ? (
                    <ListItem
                      {...props}
                      key={(option as ProfileQuickSearchType).profileId}
                      className={`suggestion ${props.className}`}
                      onClick={() => handleOptionClick(option as ProfileQuickSearchType)}
                      secondaryAction={<Icon icon='mdi:subdirectory-arrow-left' fontSize={20} />}
                      sx={{
                        '& .MuiListItemSecondaryAction-root': {
                          '& svg': {
                            cursor: 'pointer',
                            color: 'text.disabled'
                          }
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          py: 2.5,
                          px: `${theme.spacing(6)} !important`,
                          '& svg': { mr: 2.5, color: 'text.primary' }
                        }}
                      >
                        <Stack width={"100%"} mb={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 5 }}>
                            <Typography sx={{ mb: 2 }} variant='body2'>{(option as ProfileQuickSearchType).profileId}</Typography>
                            <Chip label={(option as ProfileQuickSearchType).statusName} color={paymentStatusColor[(option as ProfileQuickSearchType).status]} variant='outlined' />
                          </Box>
                          <Box>
                            <Typography sx={{ mb: 2 }}>{(option as ProfileQuickSearchType).firstName} {(option as ProfileQuickSearchType).lastName}</Typography>
                            <Box >
                              <Typography variant='body2'>Email: {(option as ProfileQuickSearchType).primaryEmail}</Typography>
                              <Typography variant='body2'>Phone: {(option as ProfileQuickSearchType).primaryPhoneNumber}</Typography>
                              <Typography variant='body2'>Address: {(option as ProfileQuickSearchType).address1} {(option as ProfileQuickSearchType).city}, {(option as ProfileQuickSearchType).state}</Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </ListItemButton>
                    </ListItem>
                  ) : null
                }}
              />
            </Box>
            {searchValue.length === 0 ? (
              <Box
                sx={{
                  p: 10,
                  display: 'grid',
                  overflow: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  height: fullScreenDialog ? 'calc(100vh - 69px)' : '100%'
                }}
              >
                <DefaultSuggestions setOpenDialog={setOpenDialog} data={userActivity as DefaultSuggestionsType[]} />
              </Box>
            ) : null}
          </Dialog>
        )}
      </Box>
    )
  }
}

export default AutocompleteComponent
