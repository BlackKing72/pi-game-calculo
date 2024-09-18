import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useState, useEffect } from 'react';
import './ApplicationPage.css';

const steps = [
    "Etapa 01",
    "Etapa 02",
    "Etapa 03",
    "Etapa 04",
    "Etapa 05",
    "Etapa 06",
];

const ApplicationPage = () => {
    const [carouselContext, setCarouselContext] = useState();
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        carouselContext?.on('select', () => {
            setCurrentStep(carouselContext.selectedScrollSnap());
        })
    }, [carouselContext]);

    const handlePreviousClicked = () => {
        if (carouselContext.canScrollPrev()) {
            carouselContext.scrollPrev()
        }
    };

    const handleNextClicked = () => {
        if (carouselContext.canScrollNext()) {
            carouselContext.scrollNext()
        }
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
                <Carousel className='w-full flex-col flex-grow' setApi={setCarouselContext} >
                    <CarouselContent>
                        {
                            steps.map((step, index) =>
                                <CarouselItem key={index} >
                                    <Step content={step} className='' />
                                </CarouselItem>
                            )
                        }
                    </CarouselContent>
                </Carousel>
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

function Step({ hidden, content }) {
    return (
        <div className={`step ${!hidden ? 'active' : ''}`}>
            <p>{content}</p>
        </div>
    )
}

export default ApplicationPage;