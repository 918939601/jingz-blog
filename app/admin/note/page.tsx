import { fetchNotes } from '@/lib/api/note'
import { fetchTags } from '@/lib/api/tag'
import AdminNotePage from '@/modules/admin/page/admin-note-page'

export default async function Page() {
  const [initialNoteResponse, initialNoteTags] = await Promise.all([
    fetchNotes({
      page: 1,
      pageSize: 50,
    }),
    fetchTags('NOTE'),
  ])

  return (
    <AdminNotePage
      initialNoteResponse={initialNoteResponse}
      initialNoteTags={initialNoteTags}
    />
  )
}
