import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FileIcon, Loader2, Image, FileText, FileSpreadsheet } from 'lucide-react';

interface FileMentionListProps {
  items: any[];
  command: (item: any) => void;
  isLoading?: boolean;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return <Image className="w-4 h-4" />;
  if (mimeType.startsWith("text/")) return <FileText className="w-4 h-4" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType === "text/csv") return <FileSpreadsheet className="w-4 h-4" />;
  return <FileIcon className="w-4 h-4" />;
};

export const FileMentionList = forwardRef((props: FileMentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.file_name, storage_path: item.storage_path });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (props.isLoading) {
    return (
      <div className="bg-popover rounded-xl shadow-xl border border-border overflow-hidden w-64 p-4 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-popover rounded-xl shadow-xl border border-border overflow-hidden w-64 max-h-80 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-200">
      {props.items.length ? (
        <div className="p-1.5 flex flex-col gap-1">
          {props.items.map((item, index) => (
            <button
              className={`
                w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors
                ${index === selectedIndex ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-popover-foreground hover:bg-muted'}
              `}
              key={index}
              onClick={() => selectItem(index)}
            >
              <div className={`p-1.5 rounded-md ${index === selectedIndex ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {getFileIcon(item.mime_type)}
              </div>
              <span className="truncate">{item.file_name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-4 text-sm font-medium text-muted-foreground text-center">
          No files found
        </div>
      )}
    </div>
  );
});

FileMentionList.displayName = 'FileMentionList';