import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { uploadFileAction, getSignedUrlAction } from "@/features/file/actions";
import { toast } from "sonner";
import { FileEntityType } from "@/features/file/types";

export const EditorFileUploadPlugin = Extension.create<{ workspaceId: string; documentId: string }>({
  name: "editorFileUpload",

  addProseMirrorPlugins() {
    const { workspaceId, documentId } = this.options;
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey("editorFileUpload"),
        props: {
          handleDrop(view, event, slice, moved) {
            if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
              const files = Array.from(event.dataTransfer.files);
              event.preventDefault();

              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (!coordinates) return false;

              files.forEach(async (file) => {
                try {
                  toast.loading(`Uploading ${file.name}...`, { id: `upload-${file.name}` });
                  
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("workspaceId", workspaceId);
                  formData.append("entityType", "document" as FileEntityType);
                  formData.append("entityId", documentId);

                  const result = await uploadFileAction(formData);

                  if (result.success && result.data) {
                    toast.success(`Uploaded ${file.name}`, { id: `upload-${file.name}` });
                    
                    // Fetch signed URL to insert into editor
                    const urlResult = await getSignedUrlAction(result.data.storage_path);
                    const fileUrl = urlResult.success ? urlResult.data : "#";

                    // Insert link node
                    editor.chain().focus()
                      .insertContentAt(coordinates.pos, [
                        {
                          type: 'text',
                          marks: [
                            {
                              type: 'link',
                              attrs: { href: fileUrl, target: '_blank' },
                            },
                          ],
                          text: file.name,
                        },
                        { type: 'text', text: ' ' }
                      ])
                      .run();
                  } else {
                    toast.error(`Failed to upload ${file.name}: ${result.error}`, { id: `upload-${file.name}` });
                  }
                } catch (error: any) {
                  toast.error(`Upload failed: ${error.message}`, { id: `upload-${file.name}` });
                }
              });

              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
