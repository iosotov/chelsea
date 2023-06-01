import React from 'react'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Box, BoxProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const WrapperStyle = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // Specify your desired background color here
  padding: '10px',
  borderRadius: '5px'
}))

const EmailEditor: React.FC = () => {
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())

  const handleEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState)
  }

  return (
    <WrapperStyle>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true }
        }}
      />
    </WrapperStyle>
  )
}

export default EmailEditor
