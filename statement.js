//Предполагаем, что import/export настроен и идет отладка только представленной функции

function statement(invoice) {

    // Расчет переменныъ начинается с 0, в случае расчета для постоянных клиентов следовало бы эти значения принимать из вне

    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Счет для ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2
    }).format;

    function countCost(basicCap, realCap, addCostPerViewer) {
        return addCostPerViewer * (realCap - basicCap);
    }

    for (let perf of invoice.performance) {
        let thisAmount = perf.cost;

        switch (perf.type) {
            case "tragedy":
                //Добавляем стоимость за каждого свыше установленного значения
                if (perf.audience > perf.basicCapasity) {
                    thisAmount += countCost(perf.basicCapasity, perf.audience, perf.addCostPerViewer);
                }
                break;

            case "comedy":
                if (perf.audience > perf.basicCapasity) {
                    thisAmount += perf.additionalCostPerf + countCost(perf.basicCapasity, perf.audience, perf.addCostPerViewer);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`Неизвестный тип: ${perf.type}`);
        }

        // Добавление бонусов
        /**
         * Бонусы расчитываются только если количество зрителей было больше 30 ? 
         * (в комедии отметка стоит на 20), не буду менять на количество зрителей, нужны дополнительныевходные данные
         * В противном случае, поменять переменную 30 на perf.basicCapasity
         */

        volumeCredits += math.max(perf.audience - 30, 0);

        // Дополнительный бонус за каждые 10 комедий
        if ("comedy" === perf.type) {
            volumeCredits += math.floor(perf.audience / 10);
        }

        // Вывод строки счета
        result += `${perf.playId}: ${format(thisAmount / 100 )}\n`;
        result += `(${perf.audience} мест)\n`;
        totalAmount += thisAmount;
        result += `Итого с вас ${format(totalAmount / 100 )}\n`;
        result += `Вы заработали ${volumeCredits} бонусов\n`;
        return result;
    }
}