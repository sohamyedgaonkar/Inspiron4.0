// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Star, Sprout, Users, GraduationCap } from "lucide-react";

// const Summary = () => {
//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-3xl font-bold mb-8">Learning Summary</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Current Skills */}
//         <Card className="bg-black/50 border-border/50">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Star className="h-5 w-5 text-yellow-400" /> Current Skills
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               <li className="flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20 text-blue-400">AI</span>
//                 <span>Artificial Intelligence</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 text-green-400">ML</span>
//                 <span>Machine Learning</span>
//               </li>
//             </ul>
//           </CardContent>
//         </Card>

//         {/* Skills to be Developed */}
//         <Card className="bg-black/50 border-border/50">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Sprout className="h-5 w-5 text-green-400" /> Skills to be Developed
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               <li className="flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/20 text-purple-400">WD</span>
//                 <span>Web Development</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500/20 text-red-400">JV</span>
//                 <span>Java</span>
//               </li>
//             </ul>
//           </CardContent>
//         </Card>

//         {/* Buddies */}
//         <Card className="bg-black/50 border-border/50">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="h-5 w-5 text-blue-400" /> Buddies
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               <li className="flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20 text-blue-400">S</span>
//                 <span>Sameer</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 text-green-400">S</span>
//                 <span>Sahil</span>
//               </li>
//             </ul>
//           </CardContent>
//         </Card>

//         {/* Mentor */}
//         <Card className="bg-black/50 border-border/50">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <GraduationCap className="h-5 w-5 text-amber-400" /> Mentor
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               <li className="flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/20 text-amber-400">A</span>
//                 <span>Aslam</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500/20 text-red-400">S</span>
//                 <span>Soham</span>
//               </li>
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Summary;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Sprout, Users, GraduationCap, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Summary = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Learning Summary</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Skills */}
        <Card className="bg-black/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" /> Current Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20 text-blue-400">AI</span>
                <span>Artificial Intelligence</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 text-green-400">ML</span>
                <span>Machine Learning</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Skills to be Developed */}
        <Card className="bg-black/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-green-400" /> Skills to be Developed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/20 text-purple-400">WD</span>
                <span>Web Development</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500/20 text-red-400">JV</span>
                <span>Java</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Buddies */}
        <Card className="bg-black/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" /> Buddies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20 text-blue-400">S</span>
                <span>Sameer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20 text-green-400">S</span>
                <span>Sahil</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Mentor */}
        <Card className="bg-black/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-amber-400" /> Mentor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/20 text-amber-400">A</span>
                <span>Aslam</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500/20 text-red-400">S</span>
                <span>Soham</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Chat Box */}
      <div className="mt-8">
        <Card className="bg-black/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-400" /> Learning Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[300px]">
              <div className="flex-1 overflow-auto p-4 space-y-4 bg-black/20 rounded-md mb-4">
                <div className="flex gap-2">
                  <div className="bg-blue-500/20 p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm text-white">Hello! How can I help with your learning journey today?</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-purple-500/20 p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm text-white">I need help with my Java assignment.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-blue-500/20 p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm text-white">Sure! What specific concepts are you working with in Java?</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Summary;
