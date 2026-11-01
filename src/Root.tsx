import { Composition } from "remotion";
import { SHOWCASE_DURATION, Showcase } from "./Showcase/Showcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        durationInFrames={SHOWCASE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
