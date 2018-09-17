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



。使用上下文可能比替代方案更简单的常见示例包括管理当前区域设置，主题或数据高速缓存。
使用上下文，我们可以避免通过中间元素传递道具：

// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // Use a Provider to pass the current theme to the tree below.
    // Any component can read it, no matter how deep it is.
    // In this example, we're passing "dark" as the current value.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton(props) {
  // Use a Consumer to read the current theme context.
  // React will find the closest theme Provider above and use its value.
  // In this example, the current theme is "dark".
  return (
    <ThemeContext.Consumer>
      {theme => <Button {...props} theme={theme} />}
    </ThemeContext.Consumer>
  );
}


Provider
<Provider value={/* some value */}>
一个React组件，允许消费者订阅上下文更改。

接受value将要传递给作为此提供者后代的消费者的道具。一个提供商可以连接到许多消费者。可以嵌套提供程序以覆盖树中更深层的值。

Consumer
<Consumer>
  {value => /* render something based on the context value */}
</Consumer>
需要作为孩子的功能。该函数接收当前上下文值并返回React节点。value传递给函数的参数将等于value树中上述此上下文的最近Provider 的prop。如果上面没有此上下文的Provider，则value参数将等于defaultValue传递给它的参数createContext()。



render props

class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}

// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}


使用HOC消费上下文
const ThemeContext = React.createContext('light');

// This function takes a component...
export function withTheme(Component) {
  // ...and returns another component...
  return function ThemedComponent(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <ThemeContext.Consumer>
        {theme => <Component {...props} theme={theme} />}
      </ThemeContext.Consumer>
    );
  };
}
现在，任何依赖于主题上下文的组件都可以使用withTheme我们创建的函数轻松订阅它：

function Button({theme, ...rest}) {
  return <button className={theme} {...rest} />;
}

const ThemedButton = withTheme(Button);