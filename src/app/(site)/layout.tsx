import { Nav } from "@/components/nav";
import { MusicPlayer } from "@/components/music-player";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      <MusicPlayer />
      {children}
    </>
  );
}
