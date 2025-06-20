
import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Textarea } from './textarea';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Link,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = "Start typing...",
  className,
  disabled = false
}: RichTextEditorProps) => {
  const [content, setContent] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState('');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent);
  };

  const getSelectedText = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      return textareaRef.current.value.substring(start, end);
    }
    return '';
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
    
    handleContentChange(newText);
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleBold = () => insertFormatting('**', '**');
  const handleItalic = () => insertFormatting('*', '*');
  const handleUnderline = () => insertFormatting('<u>', '</u>');
  const handleBulletList = () => insertFormatting('\n• ');
  const handleNumberedList = () => insertFormatting('\n1. ');
  const handleLink = () => insertFormatting('[', '](url)');

  const toolbarButtons = [
    { icon: Bold, onClick: handleBold, tooltip: 'Bold' },
    { icon: Italic, onClick: handleItalic, tooltip: 'Italic' },
    { icon: Underline, onClick: handleUnderline, tooltip: 'Underline' },
    { icon: List, onClick: handleBulletList, tooltip: 'Bullet List' },
    { icon: ListOrdered, onClick: handleNumberedList, tooltip: 'Numbered List' },
    { icon: Link, onClick: handleLink, tooltip: 'Insert Link' },
  ];

  return (
    <div className={cn("border border-input rounded-md bg-background", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-input bg-gray-50">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.onClick}
            disabled={disabled}
            className="h-8 w-8 p-0 hover:bg-gray-200"
            title={button.tooltip}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-8 px-2 text-xs hover:bg-gray-200"
          title="Clear formatting"
          onClick={() => {
            const plainText = content.replace(/\*\*|__|\*|_|<\/?u>|\[|\]\(.*?\)|^[•\d+\.]\s/gm, '');
            handleContentChange(plainText);
          }}
        >
          <Type className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[200px] rounded-t-none"
        onSelect={() => setSelectedText(getSelectedText())}
      />
    </div>
  );
};
