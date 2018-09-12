React.createElement('div')
以下是 JSX 写法：
<div />
实际上，运行 Babel 时会将<div />转换成 React.createElement('div')，编写模板时
要始终牢记这一点。

<imgsrc="https://facebook.github.io/react/img/logo.svg"
alt="React.js" />
JavaScript 的等效写法如下所示：
React.createElement("img", {
src: "https://facebook.github.io/react/img/logo.svg",
alt: "React.js"
});

React.createElement(
"div",
null,
React.createElement(
"a",
{ href: "https://facebook.github.io/react/" },
"Click me!"
)
);


与 HTML 不同，样式属性期望传入 JavaScript 对象，而不是 CSS 字符串，而且样式名的写法
为驼峰式命名法：
<div style={{ backgroundColor: 'red' }} />

展开属性
const foo = { id: 'bar' }
return <div {...foo} />
以上代码的转译结果如下所示：
var foo = { id: 'bar' };
return React.createElement('div', foo);

JSX 可以利用行内条件来判断：
<div>
{isLoggedIn && <LoginButton />}
</div>



canShowSecretData() {
const { dataIsReady, isAdmin, userHasPermissions } = this.props
return dataIsReady && (isAdmin || userHasPermissions)
}
<div>
{this.canShowSecretData() && <SecretData />}
</div>
如上所示，修改后的代码大大提升了可读性，条件语句也更直观。即使大半年后再回头看这
段代码，也能够根据函数名清晰地看懂用途。
如果不喜欢用函数，那么你可以利用对象的 getter 方法使代码更优雅。
我们定义 getter 方法来取代函数，如下所示：
get canShowSecretData() {
const { dataIsReady, isAdmin, userHasPermissions } = this.props
return dataIsReady && (isAdmin || userHasPermissions)
}
<div>
{this.canShowSecretData && <SecretData />}
</div>
同样的做法也可以用于计算属性。假设有两个独立属性 currency 和 value。除了将价格
字符串写在渲染方法中，还可以创建一个类函数：
getPrice() {
return `${this.props.currency}${this.props.value}`
}

<div>{this.getPrice()}</div>
这样做更好，因为单独抽离了生成字符串的代码，而测试包含逻辑的代码更方便。
再进一步，也可以像前面那样用 getter 取代函数：
get price() {
return `${this.props.currency}${this.props.value}`
}
<div>{this.price}</div>
回到条件语句的讨论，还有一些方案需要用到外部依赖。为了尽量小化应用包体积，最好避
免引入外部依赖，不过当前这种特殊情况值得这样做，因为改进模板的可读性有很大好处。
第一项方案是 render-if，可以执行以下命令来安装：


认为用 JSX 完成此类需求可以提高代码可读性，可以直接用现成的 Babel 插件：
jsx-control-statements。
我们来看看如何使用它。
首先安装：
npm install --save jsx-control-statements
安装完成后，将它添加到.babelrc 文件中的 Babel 插件列表。
"plugins": ["jsx-control-statements"]
接着就可以使用这个插件提供的语法了， Babel 会将它连同普通的 JSX 语法一同转译。
以下是使用该插件编写的条件语句：
<If condition={this.canShowSecretData}>
<SecretData />
</If>
它会转译为三元表达式，如下所示：
{canShowSecretData ? <SecretData /> : null}


React 领域最流行的配置之一莫过于 Airbnb 的那一套。 Airbnb 的开发者按照 React 的最佳实
践创建了一套规则集，你可以直接在代码库中使用，无须自己手动判断启用哪条规则。
要想使用这套配置，必须先安装一些依赖：
npm install --global eslint-config-airbnbeslint@^2.9.0 eslint-pluginjsx-a11y@^1.2.0 eslint-plugin-import@^1.7.0 eslint-plugin-react@^5.0.1
然后在.eslintrc 中添加以下配置：
{
"extends": "airbnb"
}
接着就可以尝试执行 ESLint 来检查你的 React 源代码文件，可以看到代码是否符合 Airbnb
规则，以及这些规则是否适合你。
以上就是开始使用代码检查工具最简单也最常用的方式。


高阶函数
const add = (x, y) => x + y
const log = func => (...args) => {
console.log(...args)
return func(...args)
}
const logAdd = log(add)

(...args) => {
console.log(...args)
return func(...args)
}