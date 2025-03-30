  import { Dialog, DialogContent } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { X } from "lucide-react";

  interface VideoPlayerProps {
    videoId: string;
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
  }

  const VideoPlayer = ({ videoId, isOpen, onClose, onComplete }: VideoPlayerProps) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[720px]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={onComplete}>Mark as Complete</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  export default VideoPlayer;