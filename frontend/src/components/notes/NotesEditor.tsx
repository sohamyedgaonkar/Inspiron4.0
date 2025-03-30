import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Save, Trash } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const NotesEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { toast } = useToast();

  // Get the current user's session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: notes, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
  });

  const handleSave = async () => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to save notes",
          variant: "destructive",
        });
        return;
      }

      // First verify that the user's profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        toast({
          title: "Error",
          description: "Your profile is not set up properly. Please try logging out and back in.",
          variant: "destructive",
        });
        return;
      }

      if (selectedNote) {
        const { error } = await supabase
          .from('notes')
          .update({ 
            title, 
            content,
            user_id: session.user.id 
          })
          .eq('id', selectedNote.id);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('notes')
          .insert([{ 
            title, 
            content,
            user_id: session.user.id 
          }]);

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Success",
        description: "Note saved successfully",
      });

      setTitle("");
      setContent("");
      setSelectedNote(null);
      refetch();
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note deleted successfully",
      });

      if (selectedNote?.id === id) {
        setTitle("");
        setContent("");
        setSelectedNote(null);
      }

      refetch();
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
      <div className="md:col-span-1 border rounded-lg p-4 space-y-4 overflow-y-auto">
        <Button
          onClick={() => {
            setTitle("");
            setContent("");
            setSelectedNote(null);
          }}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> New Note
        </Button>
        <div className="space-y-2">
          {notes?.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg cursor-pointer hover:bg-accent ${
                selectedNote?.id === note.id ? "bg-accent" : ""
              }`}
              onClick={() => {
                setSelectedNote(note);
                setTitle(note.title);
                setContent(note.content);
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{note.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(note.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 border rounded-lg p-4 space-y-4">
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full h-[calc(100%-8rem)] p-4 rounded-lg bg-background border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {selectedNote ? "Update Note" : "Save Note"}
        </Button>
      </div>
    </div>
  );
};

export default NotesEditor;