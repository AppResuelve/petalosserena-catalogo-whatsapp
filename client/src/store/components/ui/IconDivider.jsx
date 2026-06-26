import { useId } from "react";

const BONE =
  "M20.04,4h0c0-2.21-1.79-4-4-4s-4,1.79-4,4c0,1.03,.39,1.97,1.03,2.68l-6.37,6.37c-.71-.65-1.66-1.05-2.7-1.05-2.21,0-4,1.79-4,4s1.77,3.98,3.96,4h0c0,2.21,1.79,4,4,4s4-1.79,4-4c0-1.03-.39-1.97-1.03-2.68l6.37-6.37c.71,.65,1.66,1.05,2.7,1.05,2.21,0,4-1.79,4-4s-1.77-3.98-3.96-4Z";
const CAT =
  "m23.447.105c-.34-.17-.746-.133-1.047.095l-1.69,1.267c-.677-.299-1.424-.467-2.21-.467s-1.533.169-2.21.467l-1.69-1.267c-.303-.228-.709-.265-1.047-.095-.339.169-.553.516-.553.895v5.5c0,3.033,2.467,5.5,5.5,5.5s5.5-2.467,5.5-5.5V1c0-.379-.214-.725-.553-.895Zm.553,22.894h0c0,.553-.448,1-1,1h-5v-2c0-2.915-2.089-5.351-4.848-5.889-.601-.117-1.152.378-1.152.991v.004c0,.485.353.88.828.981,1.809.383,3.172,1.992,3.172,3.914v2H6.558c-3.224,0-6.558-2.058-6.558-5.5,0-2.135.945-3.659,1.779-5.004.655-1.056,1.221-1.969,1.221-2.996,0-1.135-.277-2.195-2.107-2.445-.504-.069-.893-.482-.893-.99,0-.593.519-1.074,1.107-.997,3.357.44,3.893,2.905,3.893,4.432,0,1.597-.773,2.844-1.521,4.051-.76,1.226-1.479,2.384-1.479,3.949,0,1.791,1.467,2.851,2.997,3.279.007-1.299.364-7.986,6.719-11.077.159-.07.307-.131.456-.193,1.332,2.094,3.667,3.491,6.328,3.491,1.264,0,2.454-.317,3.5-.872v8.872h1c.552,0,1,.448,1,1Z";
const HOME =
  "m15.635,12.43c0,1.277-1.917,3.491-3.301,4.598-.119.095-.28.096-.399,0-1.384-1.107-3.3-3.322-3.3-4.598,0-.789.561-1.43,1.25-1.43.622,0,1.25.374,1.25,1.209,0,.552.447,1,1,1s1-.448,1-1c0-.893.674-1.209,1.25-1.209.689,0,1.25.642,1.25,1.43Zm8.365-2.707v9.276c0,2.757-2.243,5-5,5H5c-2.757,0-5-2.243-5-5v-9.276c0-1.665.824-3.214,2.203-4.145L9.203.855c1.699-1.146,3.895-1.146,5.594,0l7,4.724c1.379.931,2.203,2.48,2.203,4.145Zm-6.365,2.707c0-1.892-1.458-3.43-3.25-3.43-.89,0-1.675.318-2.25.852-.575-.533-1.36-.852-2.25-.852-1.792,0-3.25,1.539-3.25,3.43,0,2.307,2.649,5.038,4.05,6.16.427.342.938.512,1.45.512s1.022-.171,1.449-.512c1.401-1.121,4.051-3.851,4.051-6.16Z";

const SIZE_CONFIG = {
  sm: { iconSize: 20, cycleW: 100, height: 32 },
  md: { iconSize: 28, cycleW: 140, height: 44 },
  lg: { iconSize: 36, cycleW: 170, height: 52 },
};

function IconLayer({
  path,
  color,
  patternId,
  cycleW,
  iconX,
  iconSize,
  height,
  yOffset = 0,
}) {
  return (
    <svg
      className="absolute inset-0 w-full"
      height={height}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={patternId}
          width={cycleW}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <svg
            viewBox="0 0 24 24"
            x={iconX}
            y={(height - iconSize) / 2 + yOffset}
            width={iconSize}
            height={iconSize}
            fill={color}
          >
            <path d={path} />
          </svg>
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${patternId})`} />
    </svg>
  );
}

export function IconDivider({ className = "", size = "md" }) {
  const uid = useId();
  const cfg = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const midX = cfg.cycleW / 2 - cfg.iconSize / 2;

  return (
    <div className={`w-full pointer-events-none ${className}`}>
      <div className="relative w-full" style={{ height: cfg.height }}>
        <IconLayer
          path={BONE}
          color="rgba(239,242,58,0.15)"
          patternId={`${uid}-b`}
          cycleW={cfg.cycleW}
          iconX={4}
          iconSize={cfg.iconSize}
          height={cfg.height}
          yOffset={-5}
        />
        <IconLayer
          path={CAT}
          color="rgba(239,242,58,0.25)"
          patternId={`${uid}-c`}
          cycleW={cfg.cycleW}
          iconX={midX}
          iconSize={cfg.iconSize}
          height={cfg.height}
          yOffset={0}
        />
        <IconLayer
          path={HOME}
          color="rgba(239,242,58,0.35)"
          patternId={`${uid}-h`}
          cycleW={cfg.cycleW}
          iconX={cfg.cycleW - cfg.iconSize - 4}
          iconSize={cfg.iconSize}
          height={cfg.height}
          yOffset={5}
        />
      </div>
    </div>
  );
}
