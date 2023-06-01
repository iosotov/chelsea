import React from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { styled } from '@mui/system'
import { useTheme } from '@mui/material/styles'

const EmailEditor: React.FC = () => {
  const theme = useTheme()

  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())

  const handleEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState)
  }

  const wrapperStyle = {
    backgroundColor: theme.palette.background, // Specify your desired background color here
    padding: '10px',
    borderRadius: '5px'
  }

  return (
    <div style={wrapperStyle}>
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
    </div>
  )
}

export default EmailEditor
