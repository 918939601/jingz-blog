import type { getNoteList } from '@/actions/notes'

export type NoteListItem = Awaited<ReturnType<typeof getNoteList>>[number]
