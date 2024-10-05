import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils"

import { hoverSoundClip, clickSoundClip } from "@/models/sound-clips";

import useSound from "use-sound";

type GameButtonProps = ButtonProps & {
    onClickSound?: any,
    onHoverSound?: any,
}

export const GameButton = ({ className, onClickSound, onHoverSound, ...props }: GameButtonProps) => {

    const useSoundSettings = {
        interrupt: true,
    };
    
    const [ playHoverSound ] = useSound(hoverSoundClip.file, hoverSoundClip.settings);
    const [ playClickSound ] = useSound(clickSoundClip.file, clickSoundClip.settings);

    return (
        <Button 
            className={cn('bg-blue-600 hover:bg-blue-800', className)}
            onPointerDown={e => { playClickSound(); props.onPointerDown ? props.onPointerDown(e) : {} }}
            onPointerEnter={e => { playHoverSound(); props.onPointerEnter ? props.onPointerEnter(e) : {} }}
            {...props}>
            {props.children}
        </Button>
    );
};
