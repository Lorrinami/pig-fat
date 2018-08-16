import React, {Component} from 'react';
import './App.css';
import classNames from 'classnames'

var fetch = require("node-fetch");

const winList = [{id: 1, name: '全套 Love 卡'},
    {id: 2, name: '净化卡\n（妖魔鬼怪全走开）'},
    {id: 3, name: '心愿卡\n（无净化效果）'},
    {id: 4, name: '按摩卡'},
    {id: 5, name: '召唤卡'},
    {id: 6, name: '学霸卡\n（哈哈哈）'},
    {id: 7, name: '公主卡\n（小公举就要捧在手里，吃吃吃，买买买）'},
    {id: 8, name: "爸爸卡\n（尊老爱幼）"},
    {id: 9, name: "变猪卡\n（此卡抽中后由您的小可爱使用，把您变成猪）"}]

class App extends Component {
    data = null

    selected = -1
    click = false

    localRollNumber = 0

    winName = ""

    lottery = {
        count: 9,//总共有多少个位置
        timer: 0,//setTimeout的ID
        intervalTime: 50,//初始转动速度
        times: 0,//转动次数
        totalTimes: 30,//转动基本次数
        win: -1,//中奖位置

    }

    constructor(props) {
        super(props)
        this.state = {
            rollNumber: this.localRollNumber,
        }
    }

    componentDidMount() {
        this.getRollNumber()
    }

    getRollNumber() {
        fetch("http://123.206.91.120:3000/get_record", {
            headers: {
                Accept: "application/json"
            }
        }).then(response => {
            if (response.ok) {
                return response.json(); //将字符串转换为json对象
            }
        })
            .then(responseJson => {
                this.setState({rollNumber: responseJson.rollNumber})
            })
            .catch(error => {
                console.error(error);
            });
    }


    onRoll() {
        if (this.state.rollNumber <= 0) {
            alert("警告胖猪，不要过分！")
        }

        if (this.click) {
            return false
        }

        this.lottery.intervalTime = 50
        this.roll()

        this.localRollNumber = this.localRollNumber - 1
        this.setState({rollNumber: this.localRollNumber})

        this.click = true


        fetch("http://123.206.91.120:3000/roll", {
            headers: {
                Accept: "application/json"
            }
        }).then(response => {
            if (response.ok) {
                return response.json(); //将字符串转换为json对象
            }
        })
            .then(responseJson => {
                this.data = responseJson
                for (let i = 0; i < winList.length; i++) {
                    if (winList[i].id === responseJson.record[responseJson.record.length - 1].goodId) {
                        this.lottery.win = i
                        this.winName = winList[i].name
                        break
                    }
                }

                if (this.localRollNumber !== this.data.rollNumber) {
                    this.localRollNumber = this.data.rollNumber
                    this.setState({rollNumber: this.localRollNumber})
                }
            })
            .catch(error => {
                console.error(error);
            });

    }

    roll() {
        this.lottery.times += 1

        if (this.click) {
            this.selected += 1
        }

        if (this.selected > this.lottery.count - 1 && this.selected) {
            this.selected = 0
        }
        this.forceUpdate()

        if (this.lottery.times > this.lottery.totalTimes && this.lottery.win === this.selected) {
            clearTimeout(this.lottery.timer)
            this.lottery.win = -1
            this.lottery.times = 0
            this.click = false
        } else {
            //当转动次数超过最低转动次数后，开始减速
            if (this.lottery.times > this.lottery.totalTimes && ((this.selected === 9) )) {
                this.lottery.intervalTime += 110
            } else {
                this.lottery.intervalTime += 20
            }
        }

    }

    componentDidUpdate() {
        if (this.click) {
            this.lottery.timer = setTimeout(() =>
                    this.roll(),
                this.lottery.intervalTime
            )
        }
    }

    render() {
        let giftOne = classNames({'gift-one': true, 'gift-check': this.selected === 0});
        let giftTwo = classNames({'gift-two': true, 'gift-check': this.selected === 1});
        let giftThree = classNames({'gift-three': true, 'gift-check': this.selected === 2});
        let giftFour = classNames({'gift-four': true, 'gift-check': this.selected === 3});
        let giftFive = classNames({'gift-five': true, 'gift-check': this.selected === 4});
        let giftSix = classNames({'gift-six': true, 'gift-check': this.selected === 5});
        let giftSeven = classNames({'gift-seven': true, 'gift-check': this.selected === 6});
        let giftEight = classNames({'gift-eight': true, 'gift-check': this.selected === 7});
        let giftNine = classNames({'gift-nine': true, 'gift-check': this.selected === 8});

        return (
            <div className="App">
                <h1>给七夕的🐷</h1>
                <div className="roll-content">
                    <div className={giftOne}>{"全套 Love 卡"}</div>
                    <div className={giftTwo}>{"净化卡\n（妖魔鬼怪全走开）"}</div>
                    <div className={giftThree}>{"心愿卡\n（无净化效果）"}</div>
                    <div className={giftFour}>{"按摩卡"}</div>
                    <div className={giftFive}>{"召唤卡"}</div>
                    <div className={giftSix}>{"学霸卡\n（哈哈哈）"}</div>
                    <div className={giftSeven}>{"公举卡\n（小公举就要捧在手里，吃吃吃，买买买）"}</div>
                    <div className={giftEight}>{"baba卡\n（尊老爱幼）"}</div>
                    <div className={giftNine}>{"变猪卡\n（此卡抽中后由您的小可爱使用，把您变成猪）"}</div>
                </div>
                <button className={"btn-raffle"} onClick={this.onRoll.bind(this)}>开始抽奖<span
                    className="raffle-chance">{"(可抽" + this.state.rollNumber + "次)"}</span>
                </button>
            </div>
        );
    }
}

export default App;
