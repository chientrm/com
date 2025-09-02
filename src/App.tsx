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
          {/* Product Showcase */}
          <div className="w-full mt-6">
            <h2 className="text-lg font-semibold mb-2">My Product</h2>
            <Card className="w-full flex flex-col md:flex-row items-center gap-4 p-4 border shadow-sm">
              <Avatar className="size-16">
                <AvatarImage
                  src="https://nativefetch.com/assets/nativefetch.png"
                  alt="NativeFetch Logo"
                />
                <AvatarFallback>NF</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <a
                    href="https://nativefetch.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold hover:underline"
                  >
                    NativeFetch.com
                  </a>
                  <Badge variant="secondary">Showcase</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Effortless HTTP requests for modern web apps. NativeFetch is a
                  drop-in replacement for fetch with advanced features and zero
                  dependencies.
                </div>
                <a
                  href="https://nativefetch.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block"
                >
                  <img
                    src="https://nativefetch.com/assets/new-og.png"
                    alt="NativeFetch OpenGraph"
                    className="rounded border w-full max-w-xs shadow"
                    style={{ maxHeight: 120 }}
                  />
                </a>
              </div>
            </Card>
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
