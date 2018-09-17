import React, {Component} from 'react';
import './App.css';
import classNames from 'classnames'

const WrappedComponent = React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
});

function logProps(Component) {
    class LogProps extends React.Component {
        componentDidUpdate(prevProps) {
            console.log('old props:', prevProps);
            console.log('new props:', this.props);
        }

        render() {
            const {forwardedRef, ...rest} = this.props;

            // Assign the custom prop "forwardedRef" as a ref
            return <Component ref={forwardedRef} {...rest} />;
        }
    }

    function forwardRef(props, ref) {
        return <LogProps {...props} forwardedRef={ref} />;
    }

    // Give this component a more helpful display name in DevTools.
    // e.g. "ForwardRef(logProps(MyComponent))"
    const name = Component.displayName || Component.name;
    forwardRef.displayName = `logProps(${name})`;

    return React.forwardRef(forwardRef);
}
class FancyButton extends React.Component {
    focus() {
        // ...
    }

    // ...
}

export default logProps(FancyButton);