import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";

const EmailPrompt = ({ isOpen, onSubmit, onClose }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitting(true);
      try {
        await onSubmit(email.trim());
      } catch (error) {
        console.error("Error submitting email:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-black" />
          </div>
          <DialogTitle className="text-2xl font-bold gradient-text">
            Welcome to NoteQuik!
          </DialogTitle>
          <DialogDescription className="text-white/70 text-base">
            Enter your email to get started and keep track of your learning
            journey.
          </DialogDescription>
        </DialogHeader>

        <Card className="glass border-white/20 mt-4">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                {email && !isValidEmail(email) && (
                  <p className="text-red-400 text-sm">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full font-semibold"
                disabled={isSubmitting || !email || !isValidEmail(email)}
              >
                {isSubmitting ? "Getting Started..." : "Get Started"}
              </Button>
            </form>

            <p className="text-xs text-white/50 text-center mt-4">
              We'll only use your email for session tracking. No spam, ever.
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPrompt;
