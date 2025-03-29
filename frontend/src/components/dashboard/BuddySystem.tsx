import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Users } from "lucide-react";

const BuddySystem = () => {
  const competitions = [
    {
      competitor: "Raj Kumar",
      status: "Win",
      score: 95,
      rating: 1850,
    },
    {
      competitor: "Manish Sharma",
      status: "Loss",
      score: 85,
      rating: 1750,
    },
    {
      competitor: "Rajat Verma",
      status: "Win",
      score: 88,
      rating: 1798,
    },
  ];

  return (
    <Card className="w-full bg-black/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" /> Buddy System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competitor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitions.map((comp, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{comp.competitor}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      comp.status === "Win"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {comp.status === "Win" && <Trophy className="h-4 w-4" />}
                    {comp.status}
                  </span>
                </TableCell>
                <TableCell>{comp.score}</TableCell>
                <TableCell>{comp.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BuddySystem;