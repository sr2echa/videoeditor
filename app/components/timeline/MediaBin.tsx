import { useOutletContext } from "react-router";
import { FileVideo, FileImage, Type, Clock } from "lucide-react";
import { type MediaBinItem } from "./types";
import { Badge } from "~/components/ui/badge";

interface MediaBinProps {
  mediaBinItems: MediaBinItem[];
  onAddMedia: (file: File) => Promise<void>;
  onAddText: (
    textContent: string,
    fontSize: number,
    fontFamily: string,
    color: string,
    textAlign: "left" | "center" | "right",
    fontWeight: "normal" | "bold"
  ) => void;
}

// This is required for the data router
export function loader() {
  return null;
}

export default function MediaBin() {
  const { mediaBinItems, onAddMedia, onAddText } =
    useOutletContext<MediaBinProps>();

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "video":
        return <FileVideo className="h-4 w-4" />;
      case "image":
        return <FileImage className="h-4 w-4" />;
      case "text":
        return <Type className="h-4 w-4" />;
      default:
        return <FileImage className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Compact Header */}
      <div className="p-2 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-foreground">Media Library</h3>
          <Badge variant="secondary" className="text-xs h-4 px-1.5 font-mono">
            {mediaBinItems.length}
          </Badge>
        </div>
      </div>

      {/* Media Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 panel-scrollbar">
        {mediaBinItems.map((item) => (
          <div
            key={item.id}
            className="group p-2 bg-card border border-border/50 rounded-md cursor-grab hover:bg-accent/50 transition-colors"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", JSON.stringify(item));
              console.log("Dragging item:", item.name);
            }}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                {getMediaIcon(item.mediaType)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate group-hover:text-accent-foreground transition-colors">
                  {item.name}
                </p>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge
                    variant="secondary"
                    className="text-xs px-1 py-0 h-auto"
                  >
                    {item.mediaType}
                  </Badge>

                  {item.mediaType === "video" && item.durationInSeconds > 0 && (
                    <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {item.durationInSeconds.toFixed(1)}s
                    </div>
                  )}
                </div>

                {item.mediaType === "text" && item.text && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    "{item.text.textContent}"
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {mediaBinItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileImage className="h-8 w-8 text-muted-foreground/50 mb-3" />
            <p className="text-xs text-muted-foreground">No media files</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">
              Import videos or images to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
