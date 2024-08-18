class Unit {
    constructor(dysplayName, abbr) {
        this.displayName = dysplayName;
        this.abbr = abbr;
    }
}

class Conversion {
    constructor(src, dst, onValidate) {
        this.src = src;
        this.dst = dst;
        this.onValidate = onValidate;
    }

    validate(value) {
        return this.onValidate(value);
    }
}

const Litros = new Unit('Litros', 'l');
const Mililitros = new Unit('Mililitros', 'ml');

const Gotas = new Unit('Gotas', 'gotas');
const Microgotas = new Unit('Microgotas', 'micro gotas');

const Gramas = new Unit('Gramas', 'g');
const Miligramas = new Unit('Miligramas', 'mg');

export const units = [
    Litros,
    Mililitros,
    Gramas,
    Miligramas,
    Gotas,
    Microgotas,
];

const LitrosParaMililitros = new Conversion(Litros, Mililitros, (l) => l * 1000);
const MililitrosParaLitros = new Conversion(Mililitros, Litros, (ml) => ml / 1000);
const GramasParaMiligramas = new Conversion(Gramas, Miligramas, (g) => g * 1000);
const MiligramasParaGramas = new Conversion(Miligramas, Gramas, (mg) => mg / 1000);
const MililitroParaGotas = new Conversion(Mililitros, Gotas, (ml) => ml * 20);
const GotasParaMililitro = new Conversion(Gotas, Mililitros, (gotas) => gotas / 20);

/** @type {Array<Conversion>} */
const conversions = [
    LitrosParaMililitros,
    MililitrosParaLitros,
    GramasParaMiligramas,
    MiligramasParaGramas,
    MililitroParaGotas,
    GotasParaMililitro,
];

/** 
 * @param {Unit} src A unidade do valor que você quer converter.
 * @param {Unit} dst A unidade resultado da conversão.
 * @returns {Conversion | null} Retorna uma conversão se bem sucedido ou null se algum erro acontecer.
 */
export const getConverter = (src, dst) => {
    return conversions.find((conversion) => {
        return conversion.src === src && conversion.dst === dst;
    });
};