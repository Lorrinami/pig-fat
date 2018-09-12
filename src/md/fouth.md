组件间通信
1.通过props共享数据
children 是一个特殊的 prop，拥有者组件可以将它传递给渲染方法内定义的组件
 React.PropTypes.oneOfType([
React.PropTypes.array,
React.PropTypes.element,
])
2.容器组件与表现组件
在容器组件名的末尾加上 container，而表现组件则采用原有名称，
现在我们创建一个名为 geolocation.js的新文件，在该文件中定义无状态函数式组件，如下所示：
const Geolocation = ({ latitude, longitude }) => (
<div>
<div>Latitude: {latitude}</div>
<div>Longitude: {longitude}</div>
</div>
)

Geolocation.propTypes = {
latitude: React.PropTypes.number,
longitude: React.PropTypes.number,
}

容器组件：
 更关心行为部分；
 负责渲染对应的表现组件；
 发起 API 请求并操作数据；
 定义事件处理器；
 写作类的形式。

表现组件：
 更关心视觉表现；
 负责渲染 HTML 标记（或其他组件）；
 以 props 的形式从父组件接收数据；
 通常写作无状态函数式组件。


高阶函数
当高阶函数概念应用在组件上时，我们将它简称为高阶组件。
首先我们来看看高阶组件长什么样：
const HoC = Component => EnhancedComponent
高阶组件其实就是函数，它接收组件作为参数，对组件进行增强后返回。
const withClassName = Component => props => (
<Component {...props} className="my-class" />
)
我们声明了接受 Component 参数的 withClassName 函数，然后返回另一个函数。
在我们来看看如何在组件中使用 withClassName 高阶组件。
首先，创建一个无状态函数式组件，它接收类名称并赋值给一个 div 标签：
const MyComponent = ({ className }) => (
<div className={className} />
)
MyComponent.propTypes = {
className: React.PropTypes.string,
}
我们不直接使用它，而是传递给高阶组件，如下所示：
const MyComponentWithClassName = withClassName(MyComponent)
通过将组件封装进 withClassName 函数，确保该组件可以接收 className 属性。

const withInnerWidth = Component => (
class extends React.Component {
constructor(props) {
super(props)
this.state = {
innerWidth: window.innerWidth,
}
this.handleResize = this.handleResize.bind(this)
}
componentDidMount() {
window.addEventListener('resize', this.handleResize)
}
componentWillUnmount() {
window.removeEventListener('resize', this.handleResize)
}
handleResize() {
this.setState({
innerWidth: window.innerWidth,
})
}
//最后，原先的组件按以下方式来渲染：
render() {
return <Component {...this.props} {...this.state} />
}
 }
)