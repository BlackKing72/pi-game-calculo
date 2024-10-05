import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { PropsWithChildren } from 'react';

type LoadingProps = {
    className?: string
};

export const LoadingScreen = ({className, children} : PropsWithChildren<LoadingProps>) => {
    return (
        <div className={`flex absolute inset-0 w-full h-full items-center justify-center bg-slate-50  text-orange-500 ${className ?? ''}`}>
            <div className="fixed z-0 inset-0 bg-home bg-repeat bg-cover transition-all" />
            <FontAwesomeIcon className='w-8 h-8' icon={faCircleNotch} spin />
            {children}
        </div>
    );
};