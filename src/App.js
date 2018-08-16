import React, {Component} from 'react';
import './App.css';
import classNames from 'classnames'

const winList = [{id: 1, name: '全套 Love 卡'},
    {id: 2, name: '净化卡（妖魔鬼怪全走开）'},
    {id: 3, name: '心愿卡（无净化效果）'},
    {id: 4, name: '按摩卡'},
    {id: 5, name: '召唤卡'},
    {id: 6, name: '学霸卡（哈哈哈）'},
    {id: 7, name: '公主卡（小公举就要捧在手里，吃吃吃，买买买）'},
    {id: 8, name: "爸爸卡（尊老爱幼）"},
    {id: 9, name: "变猪卡（此卡抽中后由您的小可爱使用，把您变成猪）"}]

class App extends Component {
    data = null

    selected = -1
    click = false

    localRollNumber = 10

    winName = ""

    lottery = {
        count: 9,//总共有多少个位置
        timer: 0,//setTimeout的ID
        intervalTime: 50,//初始转动速度
        times: 0,//转动次数
        totalTimes: 30,//转动基本次数
        win: -2,//中奖位置

    }

    constructor(props) {
        super(props)
        this.state = {
            rollNumber: this.localRollNumber,
        }
    }

    onRoll() {
        if (this.click) {
            return false
        }

        this.lottery.intervalTime = 50
        this.roll()

        this.localRollNumber = this.localRollNumber - 1
        this.setState({rollNumber: this.localRollNumber})

        this.click = true


        this.data = 4

        for (let i = 0; i < winList.length; i++) {
            if (winList[i].id === this.data) {
                this.lottery.win = i
                this.winName = winList[i].name
                break
            }
        }

        // if (this.localRollNumber !== this.data.rest_lottery_num) {
        //     this.localRollNumber = this.data.rest_lottery_num
        //     this.setState({rollNumber: this.localRollNumber})
        // }

    }

    roll() {
        this.lottery.times += 1

        this.selected += 1

        if (this.selected > this.lottery.count - 1) {
            this.selected = 0
        }
        this.forceUpdate()

        if (this.lottery.times > this.lottery.totalTimes && this.lottery.win === this.selected) {
            clearTimeout(this.lottery.timer)
            this.lottery.win = -2
            this.lottery.times = 0
            this.click = false

            // this.onWin(this.winName, this.data.rest_lottery_num)

            this.setState({rollNumber: this.localRollNumber})
        } else {
            //当转动次数超过最低转动次数后，开始减速
            if (this.lottery.times > this.lottery.totalTimes && ((this.selected === 6) )) {
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
        return (
            <div className="App">
                <div className="roll-content">
                    <div className="gift-one">test1</div>
                    <div className="gift-two">test2</div>
                    <div className="gift-three">test3</div>
                    <div className="gift-four">test4</div>
                    <div className="gift-five">test5</div>
                    <div className="gift-six">test6</div>
                    <div className="gift-seven">test7</div>
                    <div className="gift-eight">test8</div>
                    <div className="gift-nine">test9</div>
                </div>
            </div>
        );
    }
}

export default App;
