import pickSound from '@assets/sounds/512138__beezlefm__item-sound.wav'
import dropSound from '@assets/sounds/720217__baggonotes__item_hover.wav';
import hoverSound from '@assets/sounds/488381__wobesound__uihover1.wav';
import clickSound from '@assets/sounds/click3.ogg';

const defaultSettings = {
    interrupt: true,
};

let globalVolume = 0.5;

export const pickSoundClip = {
    file: pickSound,
    settings: {
        ...defaultSettings,
        volume: 1.0,
        
    }
};

export const dropSoundClip = {
    file: dropSound,
    settings: {
        ...defaultSettings,
        volume: 3.0,
    }
};

export const hoverSoundClip = {
    file: hoverSound,
    settings: {
        ...defaultSettings,
        volume: 3.0,
    }
};

export const clickSoundClip = {
    file: clickSound,
    settings: {
        ...defaultSettings,
        volume: 3.0,
    }
};