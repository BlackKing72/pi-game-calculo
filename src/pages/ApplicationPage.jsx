import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useState, useEffect } from 'react';
import './ApplicationPage.css';

import SwapyContainer from '@/components/swapy/SwapyContainer';
import SwapySlot from '@/components/swapy/SwapySlot';
import SwapyItem from '@/components/swapy/SwapyItem';
import SelectValue from '@/components/game-steps/SelectValue';

const steps = [
    ({setCurrentStep}) => <Step><Identificar setCurrentStep={setCurrentStep}/></Step>,
    ({setCurrentStep}) => <Step><p>Etapa 02</p></Step>,
    ({setCurrentStep}) => <Step><p>Etapa 03</p></Step>,
    ({setCurrentStep}) => <Step><p>Etapa 04</p></Step>,
    ({setCurrentStep}) => <Step><p>Etapa 05</p></Step>,
    ({setCurrentStep}) => <Step><p>Etapa 06</p></Step>,
];

const ApplicationPage = () => {
    const [currentStep, setCurrentStep] = useState(0);

    // useEffect(() => {
    //     carouselContext?.on('select', () => {
    //         setCurrentStep(carouselContext.selectedScrollSnap());
    //     })
    // }, [carouselContext]);

    const handlePreviousClicked = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
        // if (carouselContext.canScrollPrev()) {
        //     carouselContext.scrollPrev()
        // }
    };

    const handleNextClicked = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
        // if (carouselContext.canScrollNext()) {
        //     carouselContext.scrollNext()
        // }
    };


    return (
        <div className="app-page">
            <div className="app-header">
                <p className="app-question">
                    O médico prescreveu 1,5mg de cloranfenicol. Mas o medicamento que
                    existe na farmácia é de 1ml, contendo 2mg. Como proceder?
                </p>
            </div>
            <div className="app-content">
                {/* <Carousel className='w-full flex-col flex-grow' setApi={setCarouselContext} >
                    <CarouselContent> */}
                {
                    steps[currentStep](setCurrentStep)
                    // steps.map((step, index) =>
                    //     // <CarouselItem key={index} >
                    //         // <Step content={step} className='' />
                    //     // </CarouselItem>
                    // )
                }
                {/* </CarouselContent>
                </Carousel> */}
            </div>
            <div className="app-footer">
                <div className='progress'>
                    {
                        steps.map((step, index) =>
                            index === currentStep
                                ? <span key={index} className='progress-bar active' />
                                : <span key={index} className='progress-bar' />
                        )
                    }
                </div>
                <div className='nav-buttons'>
                    <Button onClick={handlePreviousClicked}>Anterior</Button>
                    <Button onClick={handleNextClicked}>Próximo</Button>
                </div>
            </div>
        </div>
    );
};

function Step({ hidden, children }) {
    return (
        <div className={`step ${!hidden ? 'active' : ''}`}>
            {children}
        </div>
    );
};

function Identificar({setCurrentStep}) {
    return (
        <div className='app-identificar'>
            <h5>Identificar</h5>
            <SelectValue
                title='O que foi prescrito?'
                values={['10mg', '100mg', '100g']}
                onSelect={e => {
                    if (e == 1) setCurrentStep(value => value + 1);
                    else alert('Valor errado! T^T');
                }} />
        </div>
    );
};

export default ApplicationPage;