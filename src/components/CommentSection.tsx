import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, User } from "lucide-react";

interface Comment {
  autor: string;
  tekst: string;
  datum: string;
}

interface CommentSectionProps {
  komentari: Comment[];
  onAddComment: (comment: Comment) => void;
}

const CommentSection = ({ komentari, onAddComment }: CommentSectionProps) => {
  const [autor, setAutor] = useState("");
  const [tekst, setTekst] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor.trim() || !tekst.trim()) return;

    setIsSubmitting(true);
    
    const newComment: Comment = {
      autor: autor.trim(),
      tekst: tekst.trim(),
      datum: new Date().toISOString().split("T")[0],
    };

    setTimeout(() => {
      onAddComment(newComment);
      setAutor("");
      setTekst("");
      setIsSubmitting(false);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl font-semibold">
          Komentari ({komentari.length})
        </h3>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-secondary/50 rounded-xl border border-border">
        <div>
          <Input
            placeholder="Vaše ime"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="font-ui"
          />
        </div>
        <div>
          <Textarea
            placeholder="Napišite svoj komentar..."
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            rows={3}
            className="font-body resize-none"
          />
        </div>
        <Button
          type="submit"
          disabled={!autor.trim() || !tekst.trim() || isSubmitting}
          className="w-full sm:w-auto"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Objavljujem..." : "Objavi komentar"}
        </Button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {komentari.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-ui">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Još nema komentara. Budite prvi!</p>
          </div>
        ) : (
          komentari.map((komentar, index) => (
            <div
              key={index}
              className="p-4 bg-card rounded-xl border border-border shadow-soft animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-ui font-semibold text-foreground">
                    {komentar.autor}
                  </span>
                  <p className="font-ui text-xs text-muted-foreground">
                    {formatDate(komentar.datum)}
                  </p>
                </div>
              </div>
              <p className="font-body text-foreground/90 pl-13">
                {komentar.tekst}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
