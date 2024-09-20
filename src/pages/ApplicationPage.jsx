import { Button } from '@/components/ui/button';
import { useState } from 'react';
import './ApplicationPage.css';

import SwapyContainer from '@/components/swapy/SwapyContainer';
import SwapySlot from '@/components/swapy/SwapySlot';
import SwapyItem from '@/components/swapy/SwapyItem';
import SelectValue from '@/components/game-steps/SelectValue';

const steps = [
    (onAnswer) => 
        <Step>
            <SelectValue
                title='O que foi prescrito?'
                values={['1,5g', '1,5mg', '1,5l']}
                onAnswer={e => onAnswer(e == 1)} />
        </Step>,
    (onAnswer) => 
        <Step>
            <SelectValue
                title='Que medicamento tem disponível?'
                values={['2mg', '2g', '2l']}
                onAnswer={e => onAnswer(e == 0)} />
        </Step>,
    (onAnswer) => 
        <Step>
             <SelectValue
                title='Que diluente tem disponível?'
                values={['1l', '1g', '1ml']}
                onAnswer={e => onAnswer(e == 2)} />
        </Step>,
    (onAnswer) => <Step><p>Etapa 04</p></Step>,
    (onAnswer) => <Step><p>Etapa 05</p></Step>,
    (onAnswer) => <Step><p>Etapa 06</p></Step>,
];

const ApplicationPage = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const handlePreviousClicked = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNextClicked = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
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
                {
                    steps[currentStep]((isCorrect) => {
                        if (isCorrect) {
                            handleNextClicked();
                        }
                        else {
                            alert("Resposta Errada! T^T")
                        }
                    })
                }
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

export default ApplicationPage;