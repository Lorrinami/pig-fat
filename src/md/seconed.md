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


1.高阶函数
const add = (x, y) => x + y
const log = func => (...args) => {
console.log(...args)//传入的2,3,最后调用add
return func(...args)
}
const logAdd = log(add)
logAdd(2,3)
(...args) => {
console.log(...args)
return func(...args)
}

2.纯粹性
纯粹函数是指它不产生副作用，也就是说它不会改变自身作用域以外的任何东西
const add = (x, y) => x + y
它可以运行多次，并且总能得到同样的结果，因为没有将数据存储在其他地方，也没有修改
任何东西。

3.不可变性
可以用 concat 方法改写以上函数，使其满足不可变性。 concat 方法会返回新数组，而且
不会修改原数组：
const add3 = arr => arr.concat(3)
const myArr = [1, 2]
const result1 = add3(myArr) // [1, 2, 3]
const result2 = add3(myArr) // [1, 2, 3]
此时即便运行该函数两次， myArr 仍然保有初始值

4.柯里化
柯里化是函数式编程的常用技巧。柯里化过程就是将多参数函数转换成单参数函数，这些单
参数函数的返回值也是函数。我们通过一个示例来弄清这个概念。
我们从前文的 add 函数入手，将它转换成柯里化函数。
原先的写法如下所示：
const add = (x, y) => x + y
将其定义为以下写法：
const add = x => y => {
console.log(x,y)
}
然后按以下方式使用它：
const add1 = add(1)
add1(2) // 3
add1(3) // 4
这种函数写法相当方便，因为传入第一个参数后，第一个值被保留起来，返回的第二个函数
可以多次复用

const add = x => y => {
console.log(x,y)
}
const add1 = add(1)//赋值给x,第一个
add1(5)//1,5

5.组合
const add = (x, y) => x + y
const square = x => x * x
这两个函数可以组合创建一个新函数，用于两数相加，再对结果求平方：
const addAndSquare = (x, y) => square(add(x, y))
遵循这个范式就可以编写小而简单、易于测试的纯粹函数，然后再将它们组合起来使用。

React 构建 UI 的方式和函数式编程原则有很多相似之处，了解得越多，也就能写出越好的
代码。