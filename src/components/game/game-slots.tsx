import { PropsWithChildren } from "react";
import SwapyItem from "../swapy/SwapyItem";
import SwapySlot from "../swapy/SwapySlot";

import { cn } from "@/lib/utils"

// import pickSound from '@assets/sounds/512138__beezlefm__item-sound.wav'
// import dropSound from '@assets/sounds/720217__baggonotes__item_hover.wav';

import { pickSoundClip, dropSoundClip, hoverSoundClip } from '@/models/sound-clips';

import useSound from "use-sound";

type PickSlotProps = { className?: string, content?: any, slotID: any, itemID: any }
function PickSlot({ className, content, slotID, itemID, ...props }: PickSlotProps) {
    const useSoundSettings = {
        interrupt: true,
    };

    const [playPickSound] = useSound(pickSoundClip.file, pickSoundClip.settings);
    const [playDropSound] = useSound(dropSoundClip.file, dropSoundClip.settings);
    const [playHoverSound] = useSound(hoverSoundClip.file, hoverSoundClip.settings);

    return (
        <SwapySlot className={cn('p-1 bg-slate-200 border border-transparent', className)} slotID={slotID} {...props}>
            <SwapyItem className='bg-orange-500' itemID={itemID}
                onPointerDown={e => { playPickSound(); }}
                // onPointerEnter={e => { playHoverSound(); }
                onPointerUp={e => { playDropSound(); }}>
                <p className='text-sm'>{content}</p>
            </SwapyItem>
        </SwapySlot>
    );
};

type DropSlotProps = { className?: string, slotID: any }
function DropSlot({ className, slotID, children }: PropsWithChildren<DropSlotProps>) {
    return (
        <SwapySlot className={`drop-slot ${className || ''}`} slotID={slotID}>
            {children}
        </SwapySlot>
    )
}

type FakeSlotProps = { className?: string, content?: any }
function FakeSlot({ className, content }: FakeSlotProps) {
    return (
        <div className={`p-1 bg-slate-200 rounded-lg ${className ?? ''}`}>
            <div className='bg-slate-500 rounded-lg w-full h-full flex items-center justify-center'>
                <p className='text-slate-50 text-sm'>{content ?? ''}</p>
            </div>
        </div>
    )
}

export {
    FakeSlot, PickSlot, DropSlot
}