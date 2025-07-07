import { useEffect, useRef, useCallback } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import LinkTool from '@editorjs/link';

interface EditorJSProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const EditorJSComponent = ({ data, onChange, placeholder = "Start writing...", readOnly = false }: EditorJSProps) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  const initializeEditor = useCallback(async () => {
    if (!holderRef.current) return;

    // Clean up existing editor
    if (editorRef.current) {
      try {
        await editorRef.current.destroy();
      } catch (error) {
        console.warn('Error destroying editor:', error);
      }
      editorRef.current = null;
    }

    // Initialize new editor
    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder,
      readOnly,
      data: data || {
        time: Date.now(),
        blocks: [],
        version: "2.30.8"
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: ['bold', 'italic'],
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4],
            defaultLevel: 2
          }
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: ['bold', 'italic'],
          config: {
            placeholder: 'Tell your story...'
          }
        },
        list: {
          class: List,
          inlineToolbar: ['bold', 'italic']
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: 'http://localhost:3000/fetchUrl', // You can implement this endpoint or remove for basic links
          }
        }
      },
      onChange: async () => {
        if (editorRef.current && !readOnly) {
          try {
            const outputData = await editorRef.current.save();
            onChange(outputData);
          } catch (error) {
            console.error('Error saving editor data:', error);
          }
        }
      }
    });

    await editor.isReady;
    editorRef.current = editor;
  }, [data, onChange, placeholder, readOnly]);

  useEffect(() => {
    initializeEditor();

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
      }
    };
  }, [initializeEditor]);

  // Update editor data when prop changes
  useEffect(() => {
    if (editorRef.current && data) {
      editorRef.current.render(data);
    }
  }, [data]);

  return (
    <div className="border rounded-lg">
      <div 
        ref={holderRef} 
        className="min-h-[200px] p-4 prose prose-sm max-w-none focus-within:outline-none"
        style={{
          fontSize: '14px',
          lineHeight: '1.6'
        }}
      />
    </div>
  );
};

export default EditorJSComponent;