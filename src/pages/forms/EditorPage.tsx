import { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useLocale } from '@/i18n'

const buttonBase =
  'px-3 py-1.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700 text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors'

const buttonActive = 'bg-theme-primary text-white border-theme-primary hover:bg-theme-primary/90'

export function EditorPage() {
  const { t } = useLocale()
  const [html, setHtml] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: t('forms.editor.placeholder'),
      }),
    ],
    content:
      '<h2>Rich Text Editor</h2><p>This is a free WYSIWYG editor powered by <strong>Tiptap</strong>.</p><ul><li>Bold / italic / headings</li><li>Lists & quotes</li><li>Undo / redo</li></ul>',
    editorProps: {
      attributes: {
        class:
          'min-h-[260px] px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-secondary-900 dark:text-white focus:outline-none',
      },
    },
    onUpdate: ({ editor: ed }) => {
      setHtml(ed.getHTML())
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900 dark:text-white">
          {t('nav.editor')}
        </h1>
        <p className="text-body-sm mt-1 text-secondary-500 dark:text-secondary-400">
          {t('forms.editor.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card rounded-xl p-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              type="button"
              className={`${buttonBase} ${editor?.isActive('bold') ? buttonActive : ''}`}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor}
            >
              {t('forms.editor.bold')}
            </button>
            <button
              type="button"
              className={`${buttonBase} ${editor?.isActive('italic') ? buttonActive : ''}`}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor}
            >
              {t('forms.editor.italic')}
            </button>
            <button
              type="button"
              className={`${buttonBase} ${editor?.isActive('strike') ? buttonActive : ''}`}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              disabled={!editor}
            >
              {t('forms.editor.strike')}
            </button>

            <div className="w-px h-7 bg-surface-200 dark:bg-surface-700 mx-1" />

            <button
              type="button"
              className={`${buttonBase} ${editor?.isActive('heading', { level: 2 }) ? buttonActive : ''}`}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              disabled={!editor}
            >
              H2
            </button>
            <button
              type="button"
              className={`${buttonBase} ${editor?.isActive('heading', { level: 3 }) ? buttonActive : ''}`}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              disabled={!editor}
            >
              H3
            </button>

            <div className="w-px h-7 bg-surface-200 dark:bg-surface-700 mx-1" />

            <button
              type="button"
              className={`${buttonBase} ${editor?.isActive('bulletList') ? buttonActive : ''}`}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={!editor}
            >
              {t('forms.editor.bullet_list')}
            </button>
            <button
              type="button"
              className={`${buttonBase} ${editor?.isActive('orderedList') ? buttonActive : ''}`}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={!editor}
            >
              {t('forms.editor.numbered_list')}
            </button>
            <button
              type="button"
              className={`${buttonBase} ${editor?.isActive('blockquote') ? buttonActive : ''}`}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={!editor}
            >
              {t('forms.editor.quote')}
            </button>

            <div className="w-px h-7 bg-surface-200 dark:bg-surface-700 mx-1" />

            <button
              type="button"
              className={buttonBase}
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor}
            >
              {t('forms.editor.undo')}
            </button>
            <button
              type="button"
              className={buttonBase}
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor}
            >
              {t('forms.editor.redo')}
            </button>
          </div>

          <EditorContent editor={editor} />
        </div>

        <div className="xl:col-span-1 card rounded-xl p-6">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('forms.editor.output_html')}</h2>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            {t('forms.editor.output_desc')}
          </p>

          <div className="mt-4">
            <pre className="text-xs leading-relaxed p-4 rounded-xl bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 overflow-auto max-h-[420px] text-secondary-800 dark:text-secondary-200">
              {html || '—'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
