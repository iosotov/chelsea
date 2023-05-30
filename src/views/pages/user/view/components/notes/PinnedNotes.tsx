import { toast } from "react-hot-toast"
import FallbackSpinner from "src/@core/components/spinner"
import { useGetProfileNotesQuery, usePutNoteUpdateMutation } from "src/store/api/apiHooks"
import { useAppSelector } from "src/store/hooks"
import { selectPinnedNotesByProfileId } from "src/store/noteSlice"
import { store } from "src/store/store"
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Divider, IconButton, Stack } from "@mui/material"




interface PinnedNotesProps {
  profileId: string
}
function PinnedNotes({ profileId }: PinnedNotesProps) {

  // API CALLS
  const { isSuccess, isError } = useGetProfileNotesQuery(profileId, { skip: !profileId })
  const [triggerUpdate, { isLoading: updateLoading }] = usePutNoteUpdateMutation()

  // GLOBAL STATE
  const pinnedNotes = useAppSelector(state => selectPinnedNotesByProfileId(state, profileId))

  // HANDLE UPDATE
  async function handleUpdateImportant(noteId: string) {
    const note = store.getState().note.entities[noteId]
    if (note) {
      const { data = undefined }: { data?: any, error?: any } = await triggerUpdate({ noteId: note.noteId, content: note.content, important: !note.important })
      if (data) {
        toast.success("You have updated note")
      }
    }
  }

  if (isError) return <>There was an error on this page</>

  if (isSuccess) return (
    <Stack>
      {pinnedNotes.map(n => {
        return (
          <>
            <Alert
              key={n.noteId}
              severity="info"
              sx={{
                width: '100%'
              }}

              action={
                <IconButton disabled={updateLoading} onClick={() => handleUpdateImportant(n.noteId)} edge="end" aria-label="delete">
                  <CloseIcon />
                </IconButton>
              }
            >Pinned Message: {n.content}
            </Alert>
            <Divider />
          </>
        )
      })}
    </Stack>

  )

  return <FallbackSpinner />
}

export default PinnedNotes
