import { File } from 'buffer'

const fileContent = new Blob(['Test PDF content'], { type: 'application/pdf' })

const testFile = new File([fileContent], 'test-pdf.pdf', { type: 'application/pdf' })

export default testFile
