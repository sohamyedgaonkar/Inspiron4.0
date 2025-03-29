import NotesEditor from "@/components/notes/NotesEditor";

const Notes = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            Keep track of your learning journey with personal notes
          </p>
        </div>
        <NotesEditor />
      </div>
    </div>
  );
};

export default Notes;