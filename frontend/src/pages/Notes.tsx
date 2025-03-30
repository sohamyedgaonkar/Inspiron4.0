// 

import { PenLine, Book, Clock } from "lucide-react";
import NotesEditor from "@/components/notes/NotesEditor";

const Notes = () => {
  return (
    <div className="min-h-screen p-6 mt-20 animate-fade-up bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">My Notes</h1>
            <p className="text-gray-400">Capture and organize your learning insights</p>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Clock className="h-5 w-5" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/60 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <PenLine className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Notes</p>
                <h3 className="text-2xl font-bold text-white">12</h3>
              </div>
            </div>
          </div>
          <div className="bg-black/60 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Book className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Course Notes</p>
                <h3 className="text-2xl font-bold text-white">8</h3>
              </div>
            </div>
          </div>
          <div className="bg-black/60 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <h3 className="text-sm font-bold text-white">2 hours ago</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Editor Section */}
        <div className="bg-black/60 rounded-xl border border-white/10 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-black/70">
          <div className="mb-6 flex items-center gap-2">
            <PenLine className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Note Editor</h2>
          </div>
          <NotesEditor />
        </div>
      </div>
    </div>
  );
};

export default Notes;