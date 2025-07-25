import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Youtube } from "lucide-react";
import { useState, useEffect } from "react";

const InputForm = ({ onSubmit, isLoading, shouldClear, onClearComplete }) => {
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("English");

  // Clear form when shouldClear prop changes to true
  useEffect(() => {
    if (shouldClear) {
      setUrl("");
      setLanguage("English");
      // Notify parent that clearing is complete
      if (onClearComplete) {
        onClearComplete();
      }
    }
  }, [shouldClear, onClearComplete]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit({ url: url.trim(), language });
    }
  };

  const isValidYouTubeUrl = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    return regex.test(url);
  };

  return (
    <Card className="glass border-white/20 max-w-2xl mx-auto">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* YouTube URL Input */}
          <div className="space-y-2">
            <Label
              htmlFor="youtube-url"
              className="text-white/90 text-base font-medium"
            >
              YouTube Video URL
            </Label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            {url && !isValidYouTubeUrl(url) && (
              <p className="text-red-400 text-sm">
                Please enter a valid YouTube URL
              </p>
            )}
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <Label className="text-white/90 text-base font-medium">
              Preferred Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white focus:border-primary focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem
                  value="English"
                  className="text-white hover:bg-white/10"
                >
                  🇺🇸 English
                </SelectItem>
                <SelectItem
                  value="Bengali"
                  className="text-white hover:bg-white/10"
                >
                  🇧🇩 বাংলা (Bengali)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full h-12 text-lg font-semibold"
            disabled={isLoading || !url || !isValidYouTubeUrl(url)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Note...
              </>
            ) : (
              "Generate Note"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InputForm;
