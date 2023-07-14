class Dlt {
    static frontAreaNums = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];
    static backAreaNums = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    #prizeNums; // 中奖号码
    #currentNums; // 当前号码
    #drawPrizeCount; // 抽奖次数
    #prizeCountDetail;
    // #startTimestamp;
    // #endTimestamp;

    constructor() {
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.#prizeNums = this.#genAreaNums(); // 生成中奖号码
        // this.#startTimestamp = new Date().getTime();
        this.#drawPrizeCount = 0;
        this.#prizeCountDetail = {
            '一等奖': { prizeAmount: 10000000, prizeCount: 0 },
            '二等奖': { prizeAmount: 100000, prizeCount: 0 },
            '三等奖': { prizeAmount: 10000, prizeCount: 0 },
            '四等奖': { prizeAmount: 3000, prizeCount: 0 },
            '五等奖': { prizeAmount: 300, prizeCount: 0 },
            '六等奖': { prizeAmount: 200, prizeCount: 0 },
            '七等奖': { prizeAmount: 100, prizeCount: 0 },
            '八等奖': { prizeAmount: 15, prizeCount: 0 },
            '九等奖': { prizeAmount: 5, prizeCount: 0 },
        }
    }

    /**
     * 获取范围内随机数
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @param {number} decimal 保留小数位数
     * @returns {number}
     */
    #random(min, max, decimal = 0) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(decimal));
    }

    /**
     * 深拷贝一个区域号码
     * @param {Array} areaNums 要复制的
     * @returns {Array}
     */
    #copyAreaNums(areaNums) {
        return JSON.parse(JSON.stringify(areaNums));
    }

    /**
     * 生成一个开奖号码
     * @returns {Array}
     */
    #genAreaNums() {
        let arr = [];
        let
            prevList = this.#copyAreaNums(Dlt.frontAreaNums),
            nextList = this.#copyAreaNums(Dlt.backAreaNums);

        let
            frontNums = [],
            backNums = [];

        for (let i = 0; i < 5; i++) {
            let index = this.#random(0, prevList.length - 1);
            frontNums = frontNums.concat(prevList.splice(index, 1));
        }
        for (let i = 0; i < 2; i++) {
            let index = this.#random(0, nextList.length - 1);
            backNums = backNums.concat(nextList.splice(index, 1));
        }
        frontNums = frontNums.sort((a, b) => a - b);
        backNums = backNums.sort((a, b) => a - b);
        arr = arr.concat(frontNums, backNums);
        return arr;
    }

    /**
     * 判断是否中奖
     */
    #isPrize() {
        // this.#currentNums.splice(0, 4, ...this.#prizeNums.slice(0, 4));
        // debugger

        // this.#currentNums = this.#prizeNums.slice(0, 7);
        // debugger

        let
            currentFrontAreaNums = this.#currentNums.slice(0, 5),
            currentBackAreaNums = this.#currentNums.slice(5, 7),
            prizeFrontAreaNums = this.#prizeNums.slice(0, 5),
            prizeBackAreaNums = this.#prizeNums.slice(5, 7)

        let
            frontCount = 0, // 前区相同号码计数
            backCount = 0; // 后区相同号码计数

        currentFrontAreaNums.forEach(prizeNum => {
            if (prizeFrontAreaNums.find(currentNum => currentNum === prizeNum)) frontCount++;
        })
        currentBackAreaNums.forEach(prizeNum => {
            if (prizeBackAreaNums.find(currentNum => currentNum === prizeNum)) backCount++;
        })

        // 按顺序判断，不要按倒序判断（倒叙判断只会出九等奖）
        if (
            (frontCount === 5 && backCount === 2)
        ) {
            this.#prizeCountDetail['一等奖'].prizeCount++;
        }
        else if (
            (frontCount === 5 && backCount === 1)
        ) {
            this.#prizeCountDetail['二等奖'].prizeCount++;
        }
        else if (
            frontCount === 5
        ) {
            this.#prizeCountDetail['三等奖'].prizeCount++;
        }
        else if (
            (frontCount === 4 && backCount === 2)
        ) {
            this.#prizeCountDetail['四等奖'].prizeCount++;
        }
        else if (
            (frontCount === 4 && backCount === 1)
        ) {
            this.#prizeCountDetail['五等奖'].prizeCount++;
        }
        else if (
            (frontCount === 3 && backCount === 2)
        ) {
            this.#prizeCountDetail['六等奖'].prizeCount++;
        }
        else if (
            frontCount === 4
        ) {
            this.#prizeCountDetail['七等奖'].prizeCount++;
        }
        else if (
            (frontCount === 3 && backCount === 1) ||
            (frontCount === 2 && backCount === 2)
        ) {
            this.#prizeCountDetail['八等奖'].prizeCount++;
        }
        else if (
            frontCount === 3 ||
            (frontCount === 1 && backCount === 2) ||
            (frontCount === 2 && backCount === 1) ||
            backCount === 2
        ) {
            this.#prizeCountDetail['九等奖'].prizeCount++;
        }
    }

    /**
     * 开奖，返回一个Generator对象
     * @returns {Generator}
     */
    *drawPrize() {
        while (this.#prizeCountDetail['一等奖'].prizeCount <= 0) { // 没有开到一等奖会一直循环
            this.#drawPrizeCount++;
            this.#currentNums = this.#genAreaNums();
            // this.#endTimestamp = new Date().getTime();

            this.#isPrize();

            let
                _days = this.#drawPrizeCount / 3 * 7,
                years = Math.floor(_days / 365),
                days = Math.round(_days % 365);

            let totalPrizeAmount = 0;
            for (let k in this.#prizeCountDetail) {
                let v = this.#prizeCountDetail[k];
                totalPrizeAmount += v.prizeAmount * v.prizeCount;
            }

            let data = {
                '中奖号码': this.#prizeNums.join(','),
                '当前号码': this.#currentNums.join(','),
                '购买次数': `${this.#drawPrizeCount}次`,
                // '总秒数': (this.#endTimestamp - this.#startTimestamp) / 1000,
                '花费时间': `${years}年${days}天`,
                '花费金额': `${this.#drawPrizeCount * 2}元`,
                '中奖金额': `${totalPrizeAmount}元`,
                '中奖详情': this.#prizeCountDetail,
                '盈亏': `${totalPrizeAmount - this.#drawPrizeCount * 2}元`,
            }
            yield data;
        }
    }
}

// if (typeof exports !== 'undefined') {
//     exports.Dlt = Dlt;
// }