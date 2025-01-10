import { Dialog, DialogClose, DialogDescription, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type GameHelpProps = React.PropsWithChildren<{
    title?: string,
    open?: boolean,
    onOpenChanged?: (open: boolean) => void,
}>;

const GameHelp = ({ title, open, onOpenChanged, children }: GameHelpProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChanged} modal={true}>
            <DialogContent hideCloseButton={true} className='w-[90%] rounded-lg'>
                <DialogHeader>
                    <DialogTitle>{title ?? 'Ajuda'}</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <div className="flex items-center space-x-2 w-full">
                    {children}
                </div>
                <DialogClose className='text-slate-50'>Fechar</DialogClose>
            </DialogContent>
        </Dialog>
    )
};

export default GameHelp;