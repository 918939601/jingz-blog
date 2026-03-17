import NoteListPage from '@/modules/main/page/note-list-page'
import { getCachedNoteListData } from '@/lib/article-page-data'

export const revalidate = 300

export default async function Page() {
  const notes = await getCachedNoteListData()
  return <NoteListPage initialNotes={notes} />
}
