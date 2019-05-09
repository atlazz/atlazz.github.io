/** 获取难度值
 *  难度曲线模型为: (ax+b)/(cx+d), 难度递增，取值区间固定为 [1, 正无穷) 
 *  Input: diffLevel - 难度级别
 *         lower - 输出值区间下界
 *         upper - 输出值区间上界
 *  Output: 难度值
 * */
export function getDiffCoeff(diffLevel: number, lower: number, upper: number): number {
    /** 例子：输出区间[1,2], 初始模型(ax+b)/(cx+d), 
     *  终点: a/c=2, ===> 取a=2, c=1, 简化模型为 (2x+b)/(x+d),
     *  起点: (2+b)/(1+d)=1, ===> d=b+1, 
     *  取b=1, 则d=2, 则模型为 (2x+1)/(x+2) */
    let a: number = upper;
    let c: number = 1;
    let b: number = 1;
    let d: number = (a + b) / lower - c;
    let diffCoeff: number = (a * diffLevel + b) / (c * diffLevel + d);
    return diffCoeff;
}
    
/** 抖动一次图标 */
export const shakeOnce = (delay: number, cell: Laya.Sprite) => {
    Laya.timer.once(delay, this, () => {
        Laya.Tween.to(cell, { rotation: -10 }, 100, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
            Laya.Tween.to(cell, { rotation: 10 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                Laya.Tween.to(cell, { rotation: -5 }, 150, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                    Laya.Tween.to(cell, { rotation: 5 }, 100, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                        Laya.Tween.to(cell, { rotation: 0 }, 50, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                            Laya.timer.clearAll(cell);
                        }));
                    }));
                }));
            }));
        }));
    });
    blinkTips(delay, cell);
}

/** 跳动一次图标 */
export const jumpeOnce = (delay: number, cell: Laya.Sprite) => {
    let initY = cell.y;
    Laya.timer.once(delay, this, () => {
        Laya.Tween.to(cell, { rotation: -10 }, 100, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
            Laya.Tween.to(cell, { rotation: 10 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                Laya.Tween.to(cell, { rotation: -5 }, 150, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                    Laya.Tween.to(cell, { rotation: 5 }, 100, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                        Laya.Tween.to(cell, { rotation: 0 }, 50, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                            Laya.timer.clearAll(cell);
                        }));
                    }));
                }));
            }));
        }));
        Laya.Tween.to(cell, { y: initY - 50 }, 200, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
            Laya.Tween.to(cell, { y: initY }, 200, Laya.Ease.sineIn);
        }));
    });
    blinkTips(delay, cell);
}

export const blinkTips = (delay: number, sprite: Laya.Sprite) => {
    //提示
    let tips = sprite.getChildByName("tips") as Laya.Sprite;
    if (tips) {
        Laya.timer.once(delay, this, () => {
            Laya.Tween.to(tips, { alpha: 0 }, 500, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                Laya.Tween.to(tips, { alpha: 1 }, 500, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                    Laya.Tween.to(tips, { alpha: 0 }, 500, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                        Laya.Tween.to(tips, { alpha: 1 }, 500, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                            Laya.Tween.to(tips, { alpha: 0 }, 500, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                                Laya.Tween.to(tips, { alpha: 1 }, 500, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                                    Laya.timer.clearAll(tips);
                                }));
                            }));
                        }));
                    }));
                }));
            }));
        });
    }
}

/** 根据权重随机获取列表的索引 */
export const randomIndex = (list: any[], ratioProp: string = 'weight', defaultRatio: number = 0): number => {
    let rangeList: [number, number][] = [];
    let totalRatio: number = 0;
    if (list && list.length) {
        for (let i: number = 0; i < list.length; i++) {
            let item: any[] = list[i];
            let itemRatio: number = Number(item[ratioProp]) || defaultRatio || 0;
            rangeList[i] = [totalRatio, totalRatio + itemRatio];
            totalRatio += itemRatio;
        }
    }
    if (totalRatio > 0) {
        let rand: number = Math.random() * totalRatio;
        for (let i: number = 0; i < rangeList.length; i++) {
            let range: [number, number] = rangeList[i];
            if (range[0] <= rand && rand < range[1]) {
                return i;
            }
        }
    }
    return 0;
}

/** 根据权重随机获取列表中的一个 */
export const getRandom = <T>(list: T[], ratioProp: string = 'weight', defaultRatio: number = 0): T => {
    if (list && list.length) {
        return list[randomIndex(list, ratioProp, defaultRatio)];
    }
    return null;
}