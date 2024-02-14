import React, { Component } from 'react';

interface AlertBoxProps {
    close(): void;
    title: string;
    message: string;
    visible: string; // 'shown' | 'hidden'
}

export class AlertBox extends Component<AlertBoxProps> {
    constructor(props: AlertBoxProps) {
        super(props);
        // no state for now
    }

    render() {
        return(
            <div id="alertBox" className={this.props.visible}>
                <div className="alertTitle">{this.props.title}</div>
                <div className='alertMessage'>{this.props.message}</div>
                <button onClick={() => this.props.close()}>Close</button>
            </div>
        )
    }
}