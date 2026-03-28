'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import styles from './RichEditor.module.css';

interface RichEditorProps {
  initialValue?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onImagePaste?: (blob: File) => Promise<string>;
  uploading?: boolean;
}

export function RichEditor({ initialValue = '', onChange, placeholder = '내용을 입력하세요...', onImagePaste, uploading }: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialValue,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste(view, event) {
        if (!onImagePaste) return false;
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find(item => item.type.startsWith('image/'));
        if (!imageItem) return false;
        const blob = imageItem.getAsFile();
        if (!blob) return false;
        event.preventDefault();
        onImagePaste(blob).then(imageUrl => {
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.image.create({ src: imageUrl })
            )
          );
        });
        return true;
      },
    },
  });

  if (!editor) return null;

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar} role="toolbar" aria-label="서식 도구">
        <button
          type="button"
          className={`${styles.toolBtn} ${isActive('bold') ? styles.toolBtnActive : ''}`}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          title="굵게 (Ctrl+B)"
          aria-label="굵게"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${isActive('italic') ? styles.toolBtnActive : ''}`}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          title="기울임 (Ctrl+I)"
          aria-label="기울임"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${isActive('underline') ? styles.toolBtnActive : ''}`}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
          title="밑줄 (Ctrl+U)"
          aria-label="밑줄"
        >
          <u>U</u>
        </button>
        <div className={styles.divider} />
        <button
          type="button"
          className={`${styles.toolBtn} ${isActive('heading', { level: 2 }) ? styles.toolBtnActive : ''}`}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
          title="제목"
          aria-label="제목"
        >
          H2
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${isActive('heading', { level: 3 }) ? styles.toolBtnActive : ''}`}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
          title="소제목"
          aria-label="소제목"
        >
          H3
        </button>
        <div className={styles.divider} />
        <button
          type="button"
          className={`${styles.toolBtn} ${isActive('bulletList') ? styles.toolBtnActive : ''}`}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          title="글머리 기호 목록"
          aria-label="글머리 기호 목록"
        >
          ≡
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${isActive('orderedList') ? styles.toolBtnActive : ''}`}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          title="번호 목록"
          aria-label="번호 목록"
        >
          1.
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${isActive('blockquote') ? styles.toolBtnActive : ''}`}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
          title="인용구"
          aria-label="인용구"
        >
          "
        </button>
        <div className={styles.divider} />
        <button
          type="button"
          className={styles.toolBtn}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().undo().run(); }}
          title="실행 취소 (Ctrl+Z)"
          aria-label="실행 취소"
        >
          ↩
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().redo().run(); }}
          title="다시 실행 (Ctrl+Y)"
          aria-label="다시 실행"
        >
          ↪
        </button>
        {uploading && <span className={styles.uploadingLabel}>이미지 업로드 중...</span>}
      </div>
      <EditorContent editor={editor} className={styles.editorContent} />
    </div>
  );
}
