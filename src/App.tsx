import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="size-20">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/70304839?v=4"
              alt="Chien Tran"
            />
            <AvatarFallback>CT</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">Chien Tran</CardTitle>
          <CardDescription className="text-center">
            <Badge className="mb-2" variant="secondary">
              Software Engineer
            </Badge>
            <div>
              Hi, I'm Chien. I build modern web apps and love open source.
              <br />
              Welcome to my personal homepage!
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <Button asChild>
            <a
              href="mailto:chientrm@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Me
            </a>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a
                href="https://github.com/chientrm"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://x.com/realchientrm"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
          <Badge variant="outline">v{__APP_VERSION__}</Badge>
          <span>
            &copy; {new Date().getFullYear()} Chien Tran. All rights reserved.
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
