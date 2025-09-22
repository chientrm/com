import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
                    href="https://nativefetch.com/?utm_source=portfolio&utm_medium=web&utm_campaign=showcase"
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
                  href="https://nativefetch.com/?utm_source=portfolio&utm_medium=web&utm_campaign=showcase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block"
                >
                  <img
                    src="https://nativefetch.com/assets/og-3.png"
                    alt="NativeFetch OpenGraph"
                    className="rounded border w-full max-w-xs shadow"
                    style={{ maxHeight: 120 }}
                  />
                </a>
              </div>
            </Card>
          </div>
          {/* Quby Stickers GIFs */}
          <div className="w-full mt-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">Funny Quby Stickers</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <img
                src="/95fc7cff-bbae-4cd7-97e5-f416cd49d1ff.webp"
                alt="Quby Sticker 1"
                className="rounded shadow max-h-32"
              />
              <img
                src="/3213b631-139f-4880-b69e-cac268cc7201.webp"
                alt="Quby Sticker 2"
                className="rounded shadow max-h-32"
              />
              <img
                src="/5a623118-dd61-41cb-8ece-f74aa41277ee.webp"
                alt="Quby Sticker 3"
                className="rounded shadow max-h-32"
              />
              <img
                src="/e0be601c-d57d-4c42-93cd-768018fb4e04.webp"
                alt="Quby Sticker 4"
                className="rounded shadow max-h-32"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} Chien Tran. All rights reserved.
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
