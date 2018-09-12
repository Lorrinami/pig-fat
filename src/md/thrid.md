解决函数绑定问题的最佳方案是在构造器内进行绑定操作，这样即使多次渲染组件，它也不
会发生任何改变。
class Button extends React.Component {
constructor(props) {
super(props)
this.handleClick = this.handleClick.bind(this)
}
handleClick() {
console.log(this)
}
render() {
return <button onClick={this.handleClick} />
}
}

无状态组件
无状态函数式组件只接收 props（以及上下文）参数，并返回相应元素。
因为无状态函数式组件不能访问组件实例，所以如果要使用 ref 或者事件处理器，需要按以
下方式来定义。
() => {
let input
const onClick = () => input.focus()
return (
<div>
<input ref={el => (input = el)} />
<button onClick={onClick}>Focus</button>
</div>
)
}
实际上，因为没有 shouldComponentUpdate 方法，所以无法通知 React 只在 props（或某
个特定 prop）变化时才渲染函数式组件

state
this.setState({
clicked: true,
}, () => {
console.log('the state is now', this.state)
})
将任意函数作为 setState 的第二个参数传递，状态更新完成时会触发该函数，同时组件完
成渲染。
无法确保调用 setState 的同步操作[……]
实际上，如果在事件处理器中触发了 setState 后，尝试将当前状态值打印到控制台中，那
么获得的是旧状态值：
handleClick() {
this.setState({
clicked: true,
})
console.log('the state is now', this.state)
}
render() {
return <button onClick={this.handleClick}>Click me!</button>
}
以上述代码段为例，控制台上将会输出 the state is now null。发生这种情况的原因
在于 React 知道如何优化事件处理器内部的状态更新，并进行批处理，以获得更好的性能。

什么时候不使用state
如果多个组件都需要跟踪同一份信息，那么应该考虑使用应用层级的状态管理器，如 Redux。
接下来我们将看看哪些情况下应该避免使用状态，以遵循最佳实践指南
只要能根据 props 计算最终值，就不应该将任何数据保存在状态中
不把没有参与渲染的数据放进状态


props

const Button = ({ text }) => <button>{text}</button>
Button.propTypes = {//传递简单类型
text: React.PropTypes.string,
}

const Profile = ({ user }) =>(
<div>{user.name} {user.surname}</div>
)
Profile.propTypes = {//传递对象
user: React.PropTypes.shape({
name: React.PropTypes.string.isRequired,
surname: React.PropTypes.string,
}).isRequired,
}

user: React.PropTypes.shape({
age: (props, propName) => {
if (!(props[propName] > 0 && props[propName] < 100)) {
return new Error(`${propName} must be between 1 and 99`)
}
return null
},
})


文档react-docgen button.js
/**
* A generic button with text.
*/
const Button = ({ text }) => <button>{text}</button>
Button.propTypes = {
/**
* The text of the button.
*/
text: React.PropTypes.string,
}
再次执行命令会得到以下结果：
{
"description": "A generic button with text.",
"methods": [],
"props": {
"text": {
"type": {
"name": "string"
 },
"required": false,
"description": "The text of the button."
}
}
}

高可用
React Storybook 分离了组件，因此无须运行整个应用就能渲染单个组件，这对开发和测试来
说都非常完美。
npm install --save @kadira/react-storybook-addon